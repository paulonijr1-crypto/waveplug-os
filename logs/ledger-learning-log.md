# Ledger Learning Log — JR / The Wave Plug
Last review: 2026-10-05

## Weekly readings
| Week ending | Revenue | Orders | Sessions | CVR | Checkout completion | AOV | Note |
|---|---|---|---|---|---|---|---|
| 2026-09-08 | £2,442/mo (avg, prior 3mo window) | 103 completed / 90d | 11,374 (90d) | 0.91% | 17.4% | £67 | First live Ledger snapshot |
| 2026-09-21 | £2,206/mo (avg of Jun, Jul, Aug 2026, full months) | 98 completed / 90d | 11,587 (90d) | 0.85% | 16.4% | £64 (Aug, full) | Checkout completion and overall CVR both fell again. September partial (19 orders, £1,220 gross through day 21) is pacing below August. |
| 2026-09-28 | £2,206/mo (same 3 full months, Jun/Jul/Aug, unchanged since Sept isn't over) | 93 completed / 90d | 11,398 (90d) | 0.82% | 15.7% | £69 (Sept partial) | Checkout completion fell a third straight week (17.4% to 16.4% to 15.7%). September now at 27 orders, £1,889 gross through day 28, pacing to roughly £2,024 for the full month, in line with August, not a recovery. |
| 2026-10-05 | £2,196/mo gross (Jul/Aug/Sep, full months, restated metric, see note below) | 87 completed / 90d | 10,405 (90d) | 0.84% | 15.6% | £72.31 (Sept, now full) | September closed at 31 orders, £2,292 gross, above the £2,024 pace projected last week. Checkout completion basically flat week on week (15.7% to 15.6%) after three straight weeks of real decline, it has not recovered, it has stopped falling for one week. Sessions down 8.7% in the 90d window (11,398 to 10,405), US mobile sessions down 19.5% (7,369 to 5,934) in the same window, the single biggest move this week. Overall CVR ticked up slightly (0.82% to 0.84%) because reach-checkout rate rose even as completion kept sliding. |

**Metric correction:** I found the 3-month revenue average has been computed inconsistently across readings, the 09-08 figure used `total_sales` (£2,442) but the 09-21 and 09-28 figures used `gross_sales` for the same Jun/Jul/Aug window (£2,206), not the same metric. Going forward I will use `gross_sales` for the 3-month run rate, matching the AOV and the sessions x CVR x AOV frame in CLAUDE.md. Restated on a consistent `gross_sales` basis, Jun/Jul/Aug was £2,206/mo and Jul/Aug/Sep (this week) is £2,196/mo, essentially flat, not the mild recovery it would look like compared against the 09-08 figure.

## Changes shipped and what happened
| Date | Change | Owner agent | Metric it should move | Reading after 14d | Verdict |
|---|---|---|---|---|---|
| none logged | Shopify Markets/USD pricing, approval queue clear, and every other proposal in `tools/queue.mjs` are still unshipped as of 2026-09-28 | The Architect / Plug | checkout completion, US mobile CVR | n/a | Nothing has shipped, so there is nothing to attribute movement to. The queue has grown, not shrunk, since last week. |
| 2026-09-10 | New Klaviyo flow "Upsell - the other half (Butter or Pomade only, day 10)" went live | The Postman | AOV, repeat purchase | 0 conversions off 8 recipients in 90d as of this pull | Still too early. Volume is too low to read anything into yet. |
| none logged | Still nothing shipped as of 2026-10-05. Queue is now 13 deep, up from last week, not down. | The Architect / Plug | checkout completion, US mobile CVR | n/a | No, because nothing has moved. This is the fourth straight week I am writing this same line. |

## Calls I got wrong
| Date | What I said | What happened | What I should read differently |
|---|---|---|---|

## Standing questions for JR
- Returning customer rate came back at 17.1% (79/463, last 365 days) from the standing query, flat with the last two readings (17.1%, 16.6%). CLAUDE.md cites 21.4% repeat elsewhere. Still unresolved: worth asking JR which window that older figure used, the live pull says retention is further from the 35 to 45% target than the brand brief currently states.
- No fixed date on record anywhere for the October brush launch, CLAUDE.md and docs/OCTOBER-LAUNCH.md both say "~October" / milestones relative to launch day, no calendar date. Today is 2026-10-05 and the month is already underway. I cannot give JR a days-remaining countdown without a real date. Worth asking JR to pin one down so the fleet (and the "launch minus 3 weeks" checklist in OCTOBER-LAUNCH.md) has something concrete to work against.

## Notes on data mechanics (for future me)
- `FROM sales ... TIMESERIES month SINCE -365d` is a rolling window. Stick to full months safely inside the window when comparing across readings. This week 2025-09 rolled fully out of the window (it showed 8 orders / £579 two readings ago), confirms the edge month keeps shifting and should never be quoted as a stable figure.
- Found and fixed a metric inconsistency this week: the 3-month revenue average used `total_sales` on 09-08 and `gross_sales` on 09-21/09-28 for nominally the same calculation, producing a false appearance of a drop (£2,442 to £2,206) that was actually a metric change, not a real move. Standardized on `gross_sales` going forward, see the weekly readings table.
- Klaviyo flow report pulled this week (last_90_days, conversion metric TEdekd): total flow attributed revenue was £353.25 across 90 days (was £295.26 two weeks ago), the increase is entirely the Welcome Flow's first ever conversion (£57.99, see below), Abandoned Checkout and Winback held steady at £211.28 and £83.98. Post Purchase, Browse Abandonment, and Thank You all converted zero again.
- The Welcome Flow (carries the WAVE10 code), flagged dead for two straight readings (zero of 116, then zero of 76), recorded its first conversion this week: 1 off 174 recipients, £57.99. No change was shipped to this flow that I can see, so I am reading this as one customer converting, not a fix. Not calling it a trend on n=1, will watch next week.
- Parcels tool (`tools/parcels.mjs`) still has nothing logged at all. That means The Mailman is not using it, not that shipping is clean. Worth a nudge, it can't warn about a scan gap it was never given data for.
