---
description: Run the shipping batch. Pull orders, build Royal Mail labels, stop at payment.
---

Spawn **The Mailman** (`the-mailman`).

Read `ops/SHIP-THESE.md` for the queue and any overrides for this batch first.

Non-negotiable: Royal Mail via `send.royalmail.com` on the "Send an item" tab, never the business portal. Never Evri. **Never pay, JR clicks pay.** Never type a login.

After the batch, hand the component demand to **The Chemist** so the make list is rebuilt against real stock.
