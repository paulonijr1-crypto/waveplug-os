#!/usr/bin/env node
// The Ledger's scoreboard. Reads state/kpis.json and prints where the money is
// leaking, what each fix is worth, and the decomposed gap to £20k a month.
//
//   node tools/scoreboard.mjs

import { load, c, gbp, pct, num, heading, rule, light } from './lib.mjs';

const k = load('state/kpis.json');
const snap = k.snapshots.at(-1);
const target = k.target;
const months = k.monthlySales.rows.filter((r) => !r.partial);
const last12 = months.slice(-12);

const completion = snap.completedCheckout / snap.reachedCheckout;
const cartRate = snap.cartAdditions / snap.sessions;
const checkoutRate = snap.reachedCheckout / snap.cartAdditions;
const lost = snap.reachedCheckout - snap.completedCheckout;

const revenue12 = last12.reduce((s, m) => s + m.total, 0);
const orders12 = last12.reduce((s, m) => s + m.orders, 0);
const aov = revenue12 / orders12;
const perMonth = revenue12 / last12.length;
const recent3 = months.slice(-3);
const recentAvg = recent3.reduce((s, m) => s + m.total, 0) / recent3.length;
const peak = months.reduce((a, b) => (b.total > a.total ? b : a));

console.log(heading('THE WAVE PLUG SCOREBOARD'));
console.log(
  `${c.dim('snapshot')} ${snap.date}  ${c.dim('window')} ${snap.window}  ${c.dim('source')} Shopify live`
);

// ---------------------------------------------------------------- the funnel
console.log(heading('THE FUNNEL (90 days)'));
const steps = [
  ['Sessions', snap.sessions, null, null],
  ['Added to cart', snap.cartAdditions, cartRate, 0.08],
  ['Reached checkout', snap.reachedCheckout, checkoutRate, 0.6],
  ['Completed checkout', snap.completedCheckout, completion, 0.45],
];
for (const [label, value, rate, healthy] of steps) {
  const bar = '█'.repeat(Math.max(1, Math.round((value / snap.sessions) * 34)));
  let line = `${label.padEnd(20)}${String(num(value)).padStart(7)}  ${c.blue(bar)}`;
  if (rate !== null) {
    const dot = light(rate, healthy, healthy * 0.66);
    line += `  ${dot} ${pct(rate)} ${c.grey(`(healthy ${pct(healthy, 0)})`)}`;
  }
  console.log(line);
}
console.log(
  `\n${c.red(c.bold(`${num(lost)} people reached the checkout and did not buy.`))}`
);
console.log(
  c.grey(`Checkout completion ${pct(completion)} against a healthy floor of 45%.`)
);

// ------------------------------------------------------- the currency signal
console.log(heading('THE CURRENCY SIGNAL'));
const us = snap.byMarket.find((m) => m.country === 'United States' && m.device === 'mobile');
const uk = snap.byMarket.find((m) => m.country === 'United Kingdom' && m.device === 'mobile');
if (us && uk) {
  console.log(`US mobile   ${String(num(us.sessions)).padStart(6)} sessions  ${c.red(pct(us.cvr, 2))}`);
  console.log(`UK mobile   ${String(num(uk.sessions)).padStart(6)} sessions  ${c.green(pct(uk.cvr, 2))}`);
  const gapOrders = us.sessions * (uk.cvr - us.cvr);
  console.log(
    `\nSame site, same products, same content. The difference is that Americans are\n` +
      `asked to buy in a foreign currency.\n`
  );
  console.log(
    `If US mobile converted like UK mobile: ${c.bold(`+${Math.round(gapOrders)} orders`)} per 90 days` +
      ` = ${c.bold(c.green(gbp((gapOrders * aov) / 3) + '/month'))}`
  );
}

// --------------------------------------------------------- what fixes are worth
console.log(heading('WHAT EACH FIX IS WORTH (per month)'));
const fixes = [];
for (const rate of [0.3, 0.4, 0.45]) {
  const extraOrders = snap.reachedCheckout * (rate - completion);
  fixes.push([
    `Checkout completion to ${pct(rate, 0)}`,
    (extraOrders * aov) / 3,
  ]);
}
const aovLift = (target.aov - aov) * (orders12 / 12);
fixes.push([`AOV from ${gbp(aov)} to ${gbp(target.aov)}`, aovLift]);
for (const [label, value] of fixes) {
  const flag = value > 1500 ? c.green('▲') : c.yellow('▲');
  console.log(`${flag} ${label.padEnd(34)} ${c.bold(gbp(value)).padStart(12)}`);
}
console.log(
  c.grey('\nAll of the above need zero extra traffic, zero extra content, zero ad spend.')
);

// ------------------------------------------------------------------- trend
console.log(heading('THE TREND'));
console.log(`Last 12 months      ${gbp(revenue12)} across ${num(orders12)} orders`);
console.log(`Average month       ${gbp(perMonth)}`);
console.log(`Last 3 months       ${gbp(recentAvg)}  ${recentAvg < perMonth ? c.red('below average') : c.green('above average')}`);
console.log(`Peak month          ${gbp(peak.total)} (${peak.month})`);
const declinePct = (peak.total - recentAvg) / peak.total;
if (recentAvg < peak.total) {
  console.log(c.red(`Down ${pct(declinePct, 0)} from peak.`));
}
const spark = months.slice(-12).map((m) => {
  const blocks = ' ▁▂▃▄▅▆▇█';
  const max = Math.max(...months.map((x) => x.total));
  return blocks[Math.max(1, Math.round((m.total / max) * 8))];
}).join('');
console.log(`${c.blue(spark)}  ${c.grey(months.at(-12).month + ' to ' + months.at(-1).month)}`);

// ------------------------------------------------------------ path to target
console.log(heading(`THE PATH TO ${gbp(target.monthlyRevenue)} A MONTH`));
const sessionsMonth = snap.sessions / 3;
const now = sessionsMonth * snap.conversionRate * aov;
console.log(
  `Today   ${num(Math.round(sessionsMonth))} sessions × ${pct(snap.conversionRate, 2)} × ${gbp(aov)} = ${c.bold(gbp(now))}`
);
console.log(
  `Target  ${num(target.monthlySessions)} sessions × ${pct(target.conversionRate, 1)} × ${gbp(target.aov)} = ${c.bold(c.green(gbp(target.monthlySessions * target.conversionRate * target.aov)))}`
);
console.log(
  `\nThat is ${c.bold((target.monthlySessions / sessionsMonth).toFixed(1) + 'x')} traffic, ` +
    `${c.bold((target.conversionRate / snap.conversionRate).toFixed(1) + 'x')} conversion, ` +
    `${c.bold((target.aov / aov).toFixed(1) + 'x')} AOV.`
);
console.log(
  c.grey(`UK mobile already converts at ${pct(uk.cvr, 2)}, so the conversion target is not aspirational.`)
);

console.log(heading('ORDER OF OPERATIONS'));
console.log(`${c.bold('1.')} Checkout and currency   ${c.grey('The Architect')}`);
console.log(`${c.bold('2.')} Email deliverability    ${c.grey('The Postman')}`);
console.log(`${c.bold('3.')} AOV and bundles         ${c.grey('The Architect + The Chemist')}`);
console.log(`${c.bold('4.')} Then traffic            ${c.grey('The Voice, Scout, The Closer')}`);
console.log(
  c.red('\nDo not reverse this order. Doubling traffic into a checkout that loses 82%\nof buyers just wastes twice as many people.')
);
console.log(rule() + '\n');
