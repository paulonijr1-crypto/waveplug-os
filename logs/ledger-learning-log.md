# Ledger Learning Log — JR / The Wave Plug
Last review: 2026-09-21

## Weekly readings
| Week ending | Revenue | Orders | Sessions | CVR | Checkout completion | AOV | Note |
|---|---|---|---|---|---|---|---|
| 2026-09-08 | £2,442/mo (avg, prior 3mo window) | 103 completed / 90d | 11,374 (90d) | 0.91% | 17.4% | £67 | First live Ledger snapshot |
| 2026-09-21 | £2,206/mo (avg of Jun, Jul, Aug 2026, full months) | 98 completed / 90d | 11,587 (90d) | 0.85% | 16.4% | £64 (Aug, full) | Checkout completion and overall CVR both fell again. September partial (19 orders, £1,220 gross through day 21) is pacing below August. |

## Changes shipped and what happened
| Date | Change | Owner agent | Metric it should move | Reading after 14d | Verdict |
|---|---|---|---|---|---|
| none logged | Shopify Markets/USD pricing, approval queue clear, and every other proposal in `tools/queue.mjs` are still unshipped as of 2026-09-21 | The Architect / Plug | checkout completion, US mobile CVR | n/a | Nothing has shipped, so there is nothing to attribute movement to. The queue has sat at double digits (13 pending, oldest 43 days) since before the last reading. |

## Calls I got wrong
| Date | What I said | What happened | What I should read differently |
|---|---|---|---|

## Standing questions for JR
- Returning customer rate came back at 16.6% (78/471, last 365 days) from the standing query. CLAUDE.md cites 21.4% repeat elsewhere. Worth asking JR which window that older figure used, the live pull says retention is further from the 35 to 45% target than the brand brief currently states.
- Welcome flow (carries the WAVE10 code) sent to 76 people in the last 90 days and converted zero of them. Is this expected, or is the flow, or the discount surfacing in it, broken. Flagging for The Postman, not fixing it myself, read only.

## Notes on data mechanics (for future me)
- `FROM sales ... TIMESERIES month SINCE -365d` is a rolling window. The oldest month bucket in the result is not the same days each pull (it now starts 2025-09-21, not 2025-09-08), so a month at the edge of the window is not directly comparable pull to pull. Stick to full months safely inside the window (roughly the last 11 to 12 months) when comparing across readings.
- Klaviyo flow report pulled this week (last_90_days, conversion metric TEdekd): total flow attributed revenue was £273.27 across 90 days, almost all of it from Abandoned Checkout (£211.28, 5 conversions off 342 recipients) and Winback (£61.99, 1 conversion off 300 recipients). Post Purchase, Browse Abandonment, Thank You, and Welcome all converted zero. Email is not moving revenue right now, consistent with CLAUDE.md calling it underused.
