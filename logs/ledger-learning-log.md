# Ledger Learning Log — JR / The Wave Plug
Last review: 2026-09-28

## Weekly readings
| Week ending | Revenue | Orders | Sessions | CVR | Checkout completion | AOV | Note |
|---|---|---|---|---|---|---|---|
| 2026-09-08 | £2,442/mo (avg, prior 3mo window) | 103 completed / 90d | 11,374 (90d) | 0.91% | 17.4% | £67 | First live Ledger snapshot |
| 2026-09-21 | £2,206/mo (avg of Jun, Jul, Aug 2026, full months) | 98 completed / 90d | 11,587 (90d) | 0.85% | 16.4% | £64 (Aug, full) | Checkout completion and overall CVR both fell again. September partial (19 orders, £1,220 gross through day 21) is pacing below August. |
| 2026-09-28 | £2,206/mo (same 3 full months, Jun/Jul/Aug, unchanged since Sept isn't over) | 93 completed / 90d | 11,398 (90d) | 0.82% | 15.7% | £69 (Sept partial) | Checkout completion fell a third straight week (17.4% to 16.4% to 15.7%). September now at 27 orders, £1,889 gross through day 28, pacing to roughly £2,024 for the full month, in line with August, not a recovery. |

## Changes shipped and what happened
| Date | Change | Owner agent | Metric it should move | Reading after 14d | Verdict |
|---|---|---|---|---|---|
| none logged | Shopify Markets/USD pricing, approval queue clear, and every other proposal in `tools/queue.mjs` are still unshipped as of 2026-09-28 | The Architect / Plug | checkout completion, US mobile CVR | n/a | Nothing has shipped, so there is nothing to attribute movement to. The queue has grown, not shrunk, since last week. |
| 2026-09-10 | New Klaviyo flow "Upsell - the other half (Butter or Pomade only, day 10)" went live | The Postman | AOV, repeat purchase | 0 conversions off 4 recipients in 90d as of this pull | Too early to tell. Volume is too low to read anything into yet. |

## Calls I got wrong
| Date | What I said | What happened | What I should read differently |
|---|---|---|---|

## Standing questions for JR
- Returning customer rate came back at 17.1% (80/468, last 365 days) from the standing query, basically flat with last week's 16.6%. CLAUDE.md cites 21.4% repeat elsewhere. Still unresolved: worth asking JR which window that older figure used, the live pull says retention is further from the 35 to 45% target than the brand brief currently states.
- Welcome flow (carries the WAVE10 code) sent to 116 people in the last 90 days and converted zero of them, still. Same dead flow flagged last week, now with more volume and still zero. Flagging for The Postman again, not fixing it myself, read only.

## Notes on data mechanics (for future me)
- `FROM sales ... TIMESERIES month SINCE -365d` is a rolling window. Stick to full months safely inside the window (roughly the last 11 to 12 months) when comparing across readings. This week 2025-09 rolled to only 8 orders / £579 gross (was 19 orders / £1,192 last week), confirms the edge month keeps shifting and should never be quoted as a stable figure.
- Klaviyo flow report pulled this week (last_90_days, conversion metric TEdekd): total flow attributed revenue was £295.26 across 90 days (was £273.27 last week), still almost all from Abandoned Checkout (£211.28, 5 conversions off 329 recipients) and Winback (£83.98, 2 conversions off 296 recipients, up from 1 conversion last week). Post Purchase, Browse Abandonment, Thank You, and Welcome all converted zero again. A new low volume Upsell flow appeared, live since 2026-09-10, 4 recipients, 0 conversions so far. Email is still not moving meaningful revenue.
- Parcels tool (`tools/parcels.mjs`) has nothing logged at all, not even a flag. That means The Mailman is not using it, not that shipping is clean. Worth a nudge, it can't warn about a scan gap it was never given data for.
