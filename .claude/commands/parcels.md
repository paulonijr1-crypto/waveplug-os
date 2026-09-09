---
description: Check whether posted parcels actually scanned into the Royal Mail network.
---

Run `node tools/parcels.mjs`.

Anything under CHASE THESE NOW or CHECK THESE needs a real look. Open each Royal Mail tracking link, read what it says, and record the result:

```
node tools/parcels.mjs mark <tracking> in-transit
node tools/parcels.mjs mark <tracking> problem --note "held, underpaid postage"
```

If you can drive the browser, check them yourself rather than handing JR a list of links. Read the page, do not guess from the tracking number.

**Anything marked `problem` goes straight to The Receptionist.** JR should reach the customer before the customer reaches him. That is the whole point of this board: the receptionist log shows every customer email in the 10/08 to 02/09 window traced back to fulfilment, not product.

If nothing needs chasing, say so in one line and stop.
