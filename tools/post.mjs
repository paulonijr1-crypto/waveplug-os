#!/usr/bin/env node
// The post log. Every video JR posts gets a row here, and every content agent
// calibrates against it. Scout went five weeks with nothing logged, which is why
// the two gate system has never been measured against a real outcome.
//
//   node tools/post.mjs                      show the log and the dry streak
//   node tools/post.mjs add --sound "X" --format wash-n-style --views 12000 \
//        --watch 8.2 --likes 900 --result win --lesson "..."
//
// Flags: --date --sound --genre --count --zone --format --hook --views --watch
//        --completion --likes --comments --shares --saves --followers --result --lesson

import { load, save, c, heading, rule, num, pct, today, daysBetween } from './lib.mjs';

const FILE = 'state/posts.json';
const db = load(FILE);
const argv = process.argv.slice(2);

function parseFlags(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('--')) continue;
    const key = args[i].slice(2);
    const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : 'true';
    out[key] = val;
  }
  return out;
}

const NUMERIC = new Set(['count', 'views', 'watch', 'completion', 'likes', 'comments', 'shares', 'saves', 'followers']);
const KEYMAP = {
  count: 'countAtPost', watch: 'avgWatchSeconds', completion: 'completionRate',
  followers: 'newFollowers',
};

if (argv[0] === 'add') {
  const f = parseFlags(argv.slice(1));
  if (!f.sound && !f.hook) {
    console.log(c.red('Need at least --sound or --hook.'));
    process.exit(1);
  }
  const row = { date: f.date ?? today() };
  for (const [k, v] of Object.entries(f)) {
    if (k === 'date') continue;
    row[KEYMAP[k] ?? k] = NUMERIC.has(k) ? Number(v) : v;
  }
  db.posts.push(row);
  db.posts.sort((a, b) => a.date.localeCompare(b.date));
  save(FILE, db);
  console.log(c.green(`Logged ${row.date}: ${row.sound ?? row.hook}`));
  console.log(c.grey('Now tell Scout and The Voice to fold the result into their learning logs.'));
  process.exit(0);
}

// ------------------------------------------------------------------ the report
const posts = db.posts.filter((p) => !p.backfilled);
const measured = posts.filter((p) => typeof p.views === 'number');

console.log(heading('POST LOG'));

if (!posts.length) {
  console.log(c.red('Nothing logged that was measured live.'));
} else {
  console.log(
    `${c.dim('date'.padEnd(12))}${c.dim('sound / hook'.padEnd(30))}${c.dim('format'.padEnd(16))}${c.dim('views'.padStart(9))}  ${c.dim('watch')}`
  );
  for (const p of posts.slice(-12)) {
    const label = (p.sound ?? p.hook ?? '').slice(0, 28);
    const views = typeof p.views === 'number' ? num(p.views) : '';
    const watch = p.avgWatchSeconds ? `${p.avgWatchSeconds}s` : '';
    const tint = p.result === 'win' ? c.green : p.result === 'flop' ? c.red : (s) => s;
    console.log(
      `${p.date.padEnd(12)}${tint(label.padEnd(30))}${(p.format ?? '').padEnd(16)}${String(views).padStart(9)}  ${watch}`
    );
  }
}

// ------------------------------------------------------------- the dry streak
const last = posts.at(-1);
const gap = last ? daysBetween(last.date, today()) : null;

console.log(heading('THE LOOP'));
console.log(`Rows logged            ${db.posts.length}  ${c.grey(`(${db.posts.length - posts.length} back filled from memory)`)}`);
console.log(`Measured live          ${measured.length}`);
if (last) {
  const tint = gap > 14 ? c.red : gap > 7 ? c.yellow : c.green;
  console.log(`Last logged post       ${last.date}  ${tint(`${gap} days ago`)}`);
}

if (gap !== null && gap > 14) {
  console.log(
    c.red(c.bold(`\n${Math.floor(gap / 7)} weeks with nothing logged.`))
  );
  console.log(
    c.red(
      'This is the failure mode of the whole OS. Scout and The Voice are producing\n' +
      'analysis that never meets a real result, so nothing they believe is tested.\n'
    )
  );
  console.log(c.bold('Standing rule: before any sound hunt, Plug asks for a film date.'));
  console.log(c.grey('If there is no film date this week, run the evergreen bench and skip the hunt.\n'));
} else if (gap !== null) {
  console.log(c.green('\nThe loop is closed. Keep logging every post.\n'));
}

// --------------------------------------------------------------- what we know
const wins = db.posts.filter((p) => p.result === 'win');
const flops = db.posts.filter((p) => p.result === 'flop');
if (wins.length || flops.length) {
  console.log(heading('WHAT THE RESULTS SAY'));
  console.log(`${c.green(`${wins.length} wins`)}  ${c.red(`${flops.length} flops`)}\n`);
  for (const p of [...wins, ...flops]) {
    if (!p.lesson) continue;
    const tag = p.result === 'win' ? c.green('WIN ') : c.red('FLOP');
    console.log(`${tag} ${c.bold(p.sound ?? p.hook)}`);
    console.log(c.grey(`     ${p.lesson}\n`));
  }
}
console.log(rule() + '\n');
