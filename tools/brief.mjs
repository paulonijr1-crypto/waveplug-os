#!/usr/bin/env node
// One screen. Run this at the start of every session.
//
//   node tools/brief.mjs

import { load, c, gbp, pct, num, heading, rule, today, daysBetween } from './lib.mjs';

const k = load('state/kpis.json');
const q = load('state/queue.json');
const p = load('state/posts.json');

const snap = k.snapshots.at(-1);
const completion = snap.completedCheckout / snap.reachedCheckout;
const lost = snap.reachedCheckout - snap.completedCheckout;
const months = k.monthlySales.rows.filter((r) => !r.partial);
const recent = months.slice(-3).reduce((s, m) => s + m.total, 0) / 3;

const pending = q.proposals.filter((x) => x.status === 'pending');
const live = p.posts.filter((x) => !x.backfilled);
const lastPost = live.at(-1);
const dry = lastPost ? daysBetween(lastPost.date, today()) : null;

const launch = daysBetween(today(), '2027-01-01');

console.log(`\n${c.bold('THE WAVE PLUG')}  ${c.grey(today())}`);
console.log(rule());

// --------------------------------------------------------------- the numbers
console.log(
  `${c.grey('Revenue')}      ${c.bold(gbp(recent))}${c.grey('/mo')}   ` +
  `${c.grey('Target')} ${gbp(k.target.monthlyRevenue)}   ` +
  `${c.grey('Gap')} ${c.red(gbp(k.target.monthlyRevenue - recent))}`
);
console.log(
  `${c.grey('Checkout')}     ${c.red(pct(completion))} complete   ` +
  `${c.grey(`${num(lost)} people walked in 90 days`)}`
);
console.log(
  `${c.grey('US vs UK')}     ${c.red('0.91%')} vs ${c.green('1.74%')} mobile   ` +
  `${c.grey('same site, foreign currency')}`
);

// ------------------------------------------------------------- what's blocked
const blockers = [];

if (pending.length > 5) {
  const oldest = Math.max(...pending.map((x) => daysBetween(x.proposed, today())));
  blockers.push({
    who: 'The whole fleet',
    what: `${pending.length} proposals waiting on a yes or no, oldest ${oldest} days`,
    fix: 'node tools/queue.mjs',
  });
}
if (dry !== null && dry > 14) {
  blockers.push({
    who: 'Scout and The Voice',
    what: `${Math.floor(dry / 7)} weeks since a post was logged, so nothing they believe is being tested`,
    fix: 'node tools/post.mjs',
  });
}
if (completion < 0.3) {
  blockers.push({
    who: 'The Architect',
    what: `checkout completion at ${pct(completion)} against a healthy 45%, worth about ${gbp(3600)} a month`,
    fix: 'node tools/scoreboard.mjs',
  });
}

if (blockers.length) {
  console.log(heading('WHAT IS ACTUALLY BLOCKED'));
  for (const b of blockers) {
    console.log(`${c.red('■')} ${c.bold(b.who)}`);
    console.log(`  ${b.what}`);
    console.log(c.grey(`  ${b.fix}\n`));
  }
} else {
  console.log(heading('NOTHING BLOCKED'));
  console.log(c.green('Fleet is clear. Pick the highest value move and go.\n'));
}

// ------------------------------------------------------------------- the clock
console.log(heading('THE CLOCK'));
if (launch > 0) {
  console.log(`${c.bold(`${launch} days`)} until the January brush launch.`);
  console.log(
    c.grey('Checkout and email have to be fixed before it lands, or the biggest\nrevenue event in the brand history drops into a funnel that loses 82%.')
  );
} else {
  console.log('Brush launch window is open.');
}

// ----------------------------------------------------------------- next moves
console.log(heading('THE THREE THINGS THAT MATTER THIS WEEK'));
console.log(`${c.bold('1.')} Clear the approval queue in one pass.        ${c.grey('15 minutes, unblocks every agent')}`);
console.log(`${c.bold('2.')} Turn on Shopify Markets so the US sees USD.  ${c.grey('one afternoon, worth about £1,400/mo')}`);
console.log(`${c.bold('3.')} Commit to a film date and log what you post. ${c.grey('restarts the learning loop')}`);
console.log(rule() + '\n');
