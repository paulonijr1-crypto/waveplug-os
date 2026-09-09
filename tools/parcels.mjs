#!/usr/bin/env node
// The parcel tracker. Catches a parcel that never scanned into the Royal Mail
// network, before the customer emails to ask where it is.
//
//   node tools/parcels.mjs                 the board
//   node tools/parcels.mjs due             only what needs checking, with links
//   node tools/parcels.mjs due --quiet     nothing on screen unless something is wrong
//   node tools/parcels.mjs add --order "#2196" --customer "Munya Jairos" \
//        --country GB --tracking VU410465543GB --service "Tracked 48"
//   node tools/parcels.mjs mark VU410465543GB in-transit --note "scanned Medway"
//   node tools/parcels.mjs archive VU410465543GB
//
// Why the thresholds are what they are: Hassan's parcel sat unscanned five days
// in August, and Darius Lee's label was bought 21 Aug and not received by Royal
// Mail until 26 Aug. Warn at 48h leaves two days to chase before either of those
// turned into a where-is-my-order email.

import { load, save, c, heading, rule, today } from './lib.mjs';

const FILE = 'state/parcels.json';
const db = load(FILE);
const TRACK_URL = (t) => `https://www.royalmail.com/track-your-item#/tracking-results/${t}`;

const argv = process.argv.slice(2);
const [cmd, ...rest] = argv;

function flags(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('--')) continue;
    const key = args[i].slice(2);
    const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : 'true';
    out[key] = val;
  }
  return out;
}

const hoursSince = (date) => (Date.now() - new Date(date + 'T12:00:00Z')) / 3600000;
const findByTracking = (t) =>
  db.parcels.find((p) => p.tracking.toUpperCase() === String(t).toUpperCase());

// ------------------------------------------------------------------ add
if (cmd === 'add') {
  const f = flags(rest);
  if (!f.tracking || !f.order) {
    console.log(c.red('Need at least --order and --tracking.'));
    process.exit(1);
  }
  if (findByTracking(f.tracking)) {
    console.log(c.yellow(`${f.tracking} is already on the board. Use mark instead.`));
    process.exit(0);
  }
  const row = {
    order: f.order,
    customer: f.customer ?? '',
    country: (f.country ?? '').toUpperCase(),
    tracking: f.tracking.toUpperCase(),
    service: f.service ?? ((f.country ?? '').toUpperCase() === 'GB' ? 'Tracked 48' : 'International Tracked'),
    posted: f.posted ?? today(),
    status: 'awaiting-scan',
    archived: false,
  };
  db.parcels.push(row);
  save(FILE, db);
  console.log(c.green(`Tracking ${row.order} ${row.tracking}, posted ${row.posted}.`));
  console.log(c.grey(`Chase it if it has not scanned by ${new Date(Date.now() + db.thresholds.warnHours * 3600000).toISOString().slice(0, 10)}.`));
  process.exit(0);
}

// ----------------------------------------------------------------- mark
if (cmd === 'mark') {
  const [tracking, status] = rest;
  const f = flags(rest);
  const p = findByTracking(tracking);
  if (!p) {
    console.log(c.red(`No parcel with tracking ${tracking}.`));
    process.exit(1);
  }
  if (!status || !db.statuses[status]) {
    console.log(c.red(`Status must be one of: ${Object.keys(db.statuses).join(', ')}`));
    process.exit(1);
  }
  p.status = status;
  p.lastChecked = today();
  if (f.note) p.note = f.note;
  if (status === 'delivered') p.archived = true;
  save(FILE, db);
  console.log(c.green(`${p.order} ${p.tracking} is now ${status}.`));
  if (status === 'problem') {
    console.log(c.yellow('Flag this to The Receptionist so the customer hears it from JR first.'));
  }
  process.exit(0);
}

// -------------------------------------------------------------- archive
if (cmd === 'archive') {
  const p = findByTracking(rest[0]);
  if (!p) {
    console.log(c.red(`No parcel with tracking ${rest[0]}.`));
    process.exit(1);
  }
  p.archived = true;
  save(FILE, db);
  console.log(c.grey(`Archived ${p.order} ${p.tracking}.`));
  process.exit(0);
}

// ------------------------------------------------------------- the board
const live = db.parcels.filter((p) => !p.archived);
const waiting = live.filter((p) => p.status === 'awaiting-scan');

const escalate = waiting.filter((p) => hoursSince(p.posted) >= db.thresholds.escalateHours);
const warn = waiting.filter((p) => {
  const h = hoursSince(p.posted);
  return h >= db.thresholds.warnHours && h < db.thresholds.escalateHours;
});
const early = waiting.filter((p) => hoursSince(p.posted) < db.thresholds.warnHours);
const moving = live.filter((p) => p.status === 'in-transit');
const problems = live.filter((p) => p.status === 'problem');

const dueOnly = cmd === 'due';
const quiet = argv.includes('--quiet');
const needsAction = escalate.length + warn.length + problems.length;

if (quiet && needsAction === 0) process.exit(0);

const flag = (p) => {
  const days = (hoursSince(p.posted) / 24).toFixed(1);
  const who = `${p.order} ${p.customer}`.trim();
  return `${who.padEnd(26)} ${p.tracking.padEnd(15)} ${c.grey(p.country.padEnd(3))} ${c.grey(days + 'd')}`;
};

console.log(heading('PARCELS'));

if (!live.length) {
  console.log(c.grey('Nothing being tracked. The Mailman adds parcels here when it books labels.\n'));
  console.log(c.grey('  node tools/parcels.mjs add --order "#2196" --customer "Munya Jairos" \\'));
  console.log(c.grey('       --country GB --tracking VU410465543GB\n'));
  process.exit(0);
}

if (problems.length) {
  console.log(c.red(c.bold('\nPROBLEM')));
  for (const p of problems) {
    console.log('  ' + flag(p));
    if (p.note) console.log(c.grey(`    ${p.note}`));
  }
}

if (escalate.length) {
  console.log(c.red(c.bold('\nCHASE THESE NOW')));
  console.log(c.grey(`Past ${db.thresholds.escalateHours}h with no scan. Hassan's sat like this for five days.`));
  for (const p of escalate) {
    console.log('  ' + flag(p));
    console.log(c.grey(`    ${TRACK_URL(p.tracking)}`));
  }
}

if (warn.length) {
  console.log(c.yellow(c.bold('\nCHECK THESE')));
  console.log(c.grey(`Past ${db.thresholds.warnHours}h with no scan.`));
  for (const p of warn) {
    console.log('  ' + flag(p));
    console.log(c.grey(`    ${TRACK_URL(p.tracking)}`));
  }
}

if (!dueOnly) {
  if (early.length) {
    console.log(c.bold('\nTOO EARLY TO WORRY'));
    console.log(c.grey('Same day or next day drops. Normal for these not to have scanned yet.'));
    for (const p of early) console.log('  ' + flag(p));
  }
  if (moving.length) {
    console.log(c.green(c.bold('\nIN TRANSIT')));
    for (const p of moving) console.log('  ' + flag(p));
  }
  const archived = db.parcels.filter((p) => p.archived).length;
  if (archived) console.log(c.grey(`\n${archived} archived.`));
}

console.log(rule());
if (needsAction === 0) {
  console.log(c.green('Nothing to chase.\n'));
} else {
  console.log(
    c.bold(`${needsAction} parcel${needsAction === 1 ? '' : 's'} need a look.`) +
    c.grey('\nOpen the links, then record what you find:')
  );
  console.log(c.grey(`  node tools/parcels.mjs mark <tracking> in-transit`));
  console.log(c.grey(`  node tools/parcels.mjs mark <tracking> problem --note "held, underpaid postage"\n`));
  console.log(
    c.grey('Anything marked problem should go to The Receptionist, so the customer hears\nit from JR before they have to ask.\n')
  );
}
