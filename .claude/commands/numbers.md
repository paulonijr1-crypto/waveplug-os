---
description: The weekly scoreboard. Live Shopify pull, the funnel, and the honest read on whether anything moved.
---

Spawn **The Ledger** (`the-ledger`) for a full weekly reading.

It should pull the standing query set from Shopify, append a fresh snapshot to `state/kpis.json`, run `node tools/scoreboard.mjs`, and report in its own format.

Hold it to its honesty rules. If nothing shipped and nothing moved, the report is three lines saying so, not a padded chart.
