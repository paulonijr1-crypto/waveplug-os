#!/usr/bin/env node
// The Chemist's make list. Explodes open orders through the bill of materials,
// compares against real stock, and tells JR what to make and what to source.
//
//   node tools/make-list.mjs                 use state/open-orders.json
//   node tools/make-list.mjs --demand "Triple Threat:2,Waveplug Elite Starter Pack:1"
//
// Why this exists: Shopify does not record what is inside a bundle, so the make
// list was being built by hand every time and Triple Threat sat under STILL
// UNKNOWN on the 2026-09-05 list. state/bom.json is the missing piece.

import { load, c, heading, rule, num } from './lib.mjs';

const inv = load('state/inventory.json');
const bom = load('state/bom.json');
const orders = load('state/open-orders.json', { orders: [] });

const args = process.argv.slice(2);
const demandFlag = args.indexOf('--demand');

// ------------------------------------------------------------- gather demand
const demand = {};
const addDemand = (item, qty) => { demand[item] = (demand[item] ?? 0) + qty; };

if (demandFlag >= 0 && args[demandFlag + 1]) {
  for (const part of args[demandFlag + 1].split(',')) {
    const [item, qty] = part.split(':');
    addDemand(item.trim(), Number(qty ?? 1));
  }
} else {
  for (const o of orders.orders ?? []) {
    for (const line of o.items ?? []) addDemand(line.title, line.qty ?? 1);
  }
}

if (!Object.keys(demand).length) {
  console.log(heading('MAKE LIST'));
  console.log(c.yellow('No open order demand to work from.\n'));
  console.log('Either populate state/open-orders.json (The Mailman writes it when it pulls');
  console.log('orders from Shopify) or pass demand directly:\n');
  console.log(c.grey('  node tools/make-list.mjs --demand "Triple Threat:2,Natural Shine Oil:1"\n'));
  process.exit(0);
}

// -------------------------------------------------- explode through the BOM
const needed = {};
const unresolved = [];
const inferred = new Set();

function explode(item, qty, depth = 0) {
  const recipe = bom.bundles[item];
  if (!recipe || depth > 3) {
    needed[item] = (needed[item] ?? 0) + qty;
    return;
  }
  if (!recipe.confirmed) inferred.add(item);
  if (recipe.unverified) unresolved.push(item);
  for (const [child, per] of Object.entries(recipe.components)) {
    explode(child, per * qty, depth + 1);
  }
}
for (const [item, qty] of Object.entries(demand)) explode(item, qty);

// --------------------------------------------------------------- the report
console.log(heading('MAKE LIST'));
console.log(c.dim(`stock pulled ${inv.pulled}   demand from ${demandFlag >= 0 ? 'the command line' : 'state/open-orders.json'}`));

const MADE_IN_HOUSE = /butter|pomade|oil|bar|clay|vinegar/i;
const make = [];
const source = [];
const fine = [];

for (const [item, need] of Object.entries(needed)) {
  const have = inv.components[item];
  const buffer = inv.buffers?.[item] ?? 0;
  if (have === undefined) {
    source.push({ item, need, have: null, short: null, unknown: true });
    continue;
  }
  const short = need + buffer - have;
  const row = { item, need, have, buffer, short };
  if (short > 0) (MADE_IN_HOUSE.test(item) ? make : source).push(row);
  else fine.push(row);
}

const byShort = (a, b) => (b.short ?? 0) - (a.short ?? 0);

function table(title, rows, verb) {
  if (!rows.length) return;
  console.log(heading(title));
  console.log(
    c.dim(verb.padEnd(6)) + c.dim('product'.padEnd(34)) + c.dim('need'.padStart(6)) +
    c.dim('have'.padStart(6)) + c.dim('buffer'.padStart(8))
  );
  for (const r of rows.sort(byShort)) {
    if (r.unknown) {
      console.log(c.yellow('  ?   ') + r.item.padEnd(34) + String(r.need).padStart(6) + c.yellow('     not tracked'));
      continue;
    }
    const qty = c.bold(c.red(String(r.short).padEnd(6)));
    console.log(qty + r.item.padEnd(34) + String(r.need).padStart(6) + String(r.have).padStart(6) + String(r.buffer).padStart(8));
  }
}

table('MAKE THESE', make, 'make');
table('SOURCE THESE', source, 'get');

if (fine.length) {
  console.log(heading('COVERED'));
  console.log(fine.sort((a, b) => a.item.localeCompare(b.item))
    .map((r) => c.green('✓ ') + `${r.item} ${c.grey(`(need ${r.need}, have ${r.have})`)}`)
    .join('\n'));
}

// ----------------------------------------------------------------- warnings
if (inferred.size || unresolved.length) {
  console.log(heading('CHECK BEFORE YOU MAKE ANYTHING'));
  for (const item of inferred) {
    const r = bom.bundles[item];
    console.log(c.yellow(`? ${item}`));
    console.log(c.grey(`  Contents inferred, not confirmed. ${r.source}`));
  }
  if (unresolved.length) {
    console.log(
      c.red(`\nThe Elite Starter Pack is 40% of revenue and its contents are not recorded anywhere.`) +
      c.red(`\nEvery number above that touches it is a guess. Ask JR to list it once, then set`) +
      c.red(`\nconfirmed to true in state/bom.json and this stops being a problem forever.`)
    );
  }
}
console.log(rule() + '\n');
