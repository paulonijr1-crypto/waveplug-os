#!/usr/bin/env node
// Scout's two gate system, in code.
//
//   node tools/sound-score.mjs                          score the newest export
//   node tools/sound-score.mjs latest --against 2026-08-07   true acceleration diff
//   node tools/sound-score.mjs data/tokchart/foo.csv
//
// Expects Tokchart export columns: rank,ugc_videos,growth_rate,artist,title,isrc
// growth_rate is read as new videos per day.
//
// The rules this encodes, from logs/tokchart-learning-log.md:
//   - Zones price the ANCHOR game only. They are not a gate. A vibe perfect sound
//     can go viral at any saturation (Love Me, 14M views at ~800k posts).
//   - Acceleration beats raw growth. Deep Sea Diver flopped posting into a
//     decelerating curve.
//   - Urgency clocks only belong on sounds with a stated vibe hypothesis (SC-06).
//   - A baseline older than 7 days gets said out loud, not quietly diffed (SC-12).

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, parseCsv, c, heading, rule, num, pct, today, daysBetween } from './lib.mjs';

const ZONES = [
  { name: 'pre',       max: 80_000,    note: 'too early, no proof it moves' },
  { name: 'entry',     max: 350_000,   note: 'best anchor pricing' },
  { name: 'mid',       max: 1_000_000, note: 'reach still live, anchor odds thinning' },
  { name: 'saturated', max: Infinity,  note: 'reach play only, vibe must be perfect' },
];
const zoneOf = (n) => ZONES.find((z) => n <= z.max);

const TOKCHART = resolve(ROOT, 'data/tokchart');

function exports_() {
  if (!existsSync(TOKCHART)) return [];
  return readdirSync(TOKCHART)
    .filter((f) => /^trending-songs-.*\.csv$/.test(f))
    .map((f) => ({ file: f, date: (f.match(/(\d{4}-\d{2}-\d{2})/) ?? [])[1] ?? '' }))
    .filter((e) => e.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function read(file) {
  const rows = parseCsv(readFileSync(file, 'utf8'));
  return rows
    .map((r) => ({
      rank: Number(r.rank),
      count: Number(r.ugc_videos),
      perDay: Number(r.growth_rate),
      artist: r.artist,
      title: r.title,
      isrc: r.isrc,
    }))
    .filter((r) => Number.isFinite(r.count) && r.count > 0);
}

const args = process.argv.slice(2);
const againstIdx = args.indexOf('--against');
const againstArg = againstIdx >= 0 ? args[againstIdx + 1] : null;
const target = args.find((a) => a !== '--against' && a !== againstArg && !a.startsWith('--'));

const all = exports_();
let file, fileDate;
if (target && target !== 'latest') {
  file = resolve(ROOT, target);
  fileDate = (target.match(/(\d{4}-\d{2}-\d{2})/) ?? [])[1] ?? today();
} else {
  const latest = all.at(-1);
  if (!latest) {
    console.log(c.red('No Tokchart exports in data/tokchart/.'));
    console.log(c.grey('Save one as data/tokchart/trending-songs-US-YYYY-MM-DD.csv (rule SC-12).'));
    process.exit(1);
  }
  file = resolve(TOKCHART, latest.file);
  fileDate = latest.date;
}

const rows = read(file);
const market = (file.match(/trending-songs-([A-Z]+)-/) ?? [])[1] ?? '?';

console.log(heading('SOUND BOARD'));
console.log(`${c.dim('export')} ${file.split(/[\\/]/).pop()}   ${c.dim('market')} ${market}   ${c.dim('rows')} ${rows.length}`);

// -------------------------------------------------------- staleness (rule SC-12)
const age = daysBetween(fileDate, today());
if (age > 7) {
  console.log(
    c.red(c.bold(`\nSTALE BASELINE. This export is ${age} days old.`)) +
      c.red('\nCounts below are historical, not what the chart says today. Pull a fresh\nexport from tokchart.com before acting on any of it.')
  );
} else {
  console.log(c.green(`\nExport is ${age} days old, fresh enough to act on.`));
}

// ------------------------------------------------- acceleration diff, if we can
let prev = null;
if (againstArg) {
  const match = all.find((e) => e.date === againstArg || e.file === againstArg);
  if (!match) console.log(c.red(`\nNo export found for ${againstArg}.`));
  else prev = { rows: read(resolve(TOKCHART, match.file)), date: match.date };
} else {
  const earlier = all.filter((e) => e.date < fileDate).at(-1);
  if (earlier) prev = { rows: read(resolve(TOKCHART, earlier.file)), date: earlier.date };
}

let prevByIsrc = null;
if (prev) {
  const gap = daysBetween(prev.date, fileDate);
  if (gap <= 0) {
    prev = null;
  } else {
    prevByIsrc = new Map(prev.rows.filter((r) => r.isrc).map((r) => [r.isrc, r]));
    console.log(
      c.grey(`Diffing against ${prev.date}, a ${gap} day gap. ${gap > 7 ? 'Coarse, treat acceleration as directional.' : 'Tight enough for a real read.'}`)
    );
    for (const r of rows) {
      const before = r.isrc && prevByIsrc.get(r.isrc);
      if (!before) { r.status = 'NEW'; continue; }
      const observed = (r.count - before.count) / gap;
      r.observedPerDay = observed;
      r.accel = before.perDay > 0 ? observed / before.perDay : null;
      r.status = r.accel == null ? 'SEEN' : r.accel >= 1.25 ? 'ACCEL' : r.accel <= 0.75 ? 'DECEL' : 'STEADY';
    }
  }
}
if (!prev) {
  console.log(
    c.yellow('No earlier export to diff against, so there is no true acceleration read.') +
      c.grey('\nSingle snapshot only. Growth below is what Tokchart reports, not measured change.')
  );
}

// ------------------------------------------------------------------- scoring
for (const r of rows) {
  r.zone = zoneOf(r.count);
  r.pctDay = r.count > 0 ? r.perDay / r.count : 0;
  // Days until the sound leaves the entry zone at its current rate.
  r.daysToExit = r.perDay > 0 && r.count < 350_000 ? (350_000 - r.count) / r.perDay : null;
  // Anchor score prices the entry game only: reward being early and moving fast.
  const zoneWeight = { pre: 0.55, entry: 1, mid: 0.45, saturated: 0.2 }[r.zone.name];
  const accelWeight = r.status === 'ACCEL' ? 1.35 : r.status === 'DECEL' ? 0.5 : 1;
  r.anchor = r.pctDay * 100 * zoneWeight * accelWeight;
}

function table(title, list, note) {
  if (!list.length) return;
  console.log(heading(title));
  if (note) console.log(c.grey(note + '\n'));
  console.log(
    c.dim('sound'.padEnd(34)) + c.dim('count'.padStart(10)) + c.dim('/day'.padStart(9)) +
    c.dim('%/day'.padStart(8)) + c.dim('  zone'.padEnd(12)) + c.dim('move')
  );
  for (const r of list) {
    const name = `${r.title}${r.artist ? ' · ' + r.artist : ''}`.slice(0, 32);
    const zoneTint = { entry: c.green, pre: c.yellow, mid: c.blue, saturated: c.grey }[r.zone.name];
    const moveTint = { ACCEL: c.green, DECEL: c.red, NEW: c.blue }[r.status] ?? c.grey;
    let line =
      name.padEnd(34) +
      num(r.count).padStart(10) +
      ('+' + num(Math.round(r.perDay))).padStart(9) +
      (r.pctDay * 100).toFixed(1).padStart(7) + '%' +
      '  ' + zoneTint(r.zone.name.padEnd(10)) +
      moveTint(r.status ?? '');
    if (r.accel) line += c.grey(` ${r.accel.toFixed(1)}x`);
    console.log(line);
    if (r.daysToExit !== null && r.daysToExit < 7 && r.zone.name === 'entry') {
      console.log(c.yellow(`${' '.repeat(34)}leaves the entry zone in ~${r.daysToExit.toFixed(1)} days`));
    }
  }
}

const anchors = rows
  .filter((r) => r.zone.name === 'entry' || r.zone.name === 'pre')
  .sort((a, b) => b.anchor - a.anchor)
  .slice(0, 10);

const reach = rows
  .filter((r) => r.count > 1_000_000)
  .sort((a, b) => b.perDay - a.perDay)
  .slice(0, 6);

const lottery = rows
  .filter((r) => r.pctDay > 0.15)
  .sort((a, b) => b.pctDay - a.pctDay)
  .slice(0, 6);

table('ANCHOR BOARD', anchors, 'Entry and pre zone, best long tail pricing. Ranked by growth rate weighted for zone and acceleration.');
table('REACH BOARD', reach, 'Big sounds moving fast. Reach play only, and only if the vibe actually fits.');
table('LOTTERY', lottery, 'Over 15% a day. Violent growth, short window, mostly noise. Never post one of these on count alone.');

console.log(heading('HOW TO USE THIS'));
console.log(`${c.bold('1.')} Vibe gate first. ${c.grey('Zones price the anchor game, they are not a gate.')}`);
console.log(`   ${c.grey('Love Me went 14M views at ~800k posts because the vibe was right.')}`);
console.log(`${c.bold('2.')} Ear test before any clock. ${c.grey('No urgency on a sound JR has not heard (SC-06).')}`);
console.log(`${c.bold('3.')} Smooth R&B, throwback hip hop and slowed registers win in waves. Bouncy loses.`);
console.log(`   ${c.grey('Coconut Water had perfect position and flopped on vibe alone.')}`);
console.log(`${c.bold('4.')} Check the film date before any of this matters.`);
console.log(c.grey('\n   node tools/post.mjs      to see whether anything is actually getting posted\n'));
console.log(rule() + '\n');
