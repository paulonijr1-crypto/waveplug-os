# How a week actually runs

The fleet is not short of intelligence. It has been short of a loop. This is the loop.

Everything here is designed around one constraint: **JR is a pharmacist three days a week and packs his own parcels.** A system that needs an hour a day will not survive contact with a Tuesday. So the week below costs about 90 minutes total, and it is arranged so the expensive thinking happens when he is not there.

---

## The one rule that beats every other rule

**Conversion and AOV before traffic.**

Today the store turns 11,374 sessions into 103 orders. 488 people reached the checkout in 90 days and left. Until that changes, every hour spent on reach is buying twice as many people the chance to walk away at the last screen.

This is not a preference, it is arithmetic. Getting checkout completion from 17.4% to 45% is worth roughly £3,600 a month on traffic JR already has. Doubling his traffic at today's conversion is worth about £2,300 and costs vastly more.

**So: The Architect goes first. Then The Postman. Then The Voice, Scout and The Closer.**

---

## Monday, 20 minutes, the reset

```
/brief
```

Read it. Then do the two things that unblock everyone else:

1. **Clear the approval queue.** `node tools/queue.mjs`, then one pass of yes or no. Do not deliberate. A rejected proposal is worth more than a pending one, because pending ones stop the agents proposing anything new.
2. **Commit to a film date.** Say the day out loud. Every content agent's output is worthless without one, and the system has already burned five weeks proving that.

Then `/numbers` if it is the first Monday of the month, for the full Ledger reading.

## Midweek, whenever a parcel run happens

```
/ship      then     /stock
```

The Mailman pulls the orders and builds labels, stopping at payment. JR pays. Then The Chemist rebuilds the make list from what just left the building, so the next batch of butter gets made before it is urgent rather than after.

## The film day

```
/sound     then write     then     /post
```

Scout picks, The Voice writes, JR films. **Then log it.** The logging is not admin, it is the only thing that makes the next pick better than this one. Five minutes.

## Any day, in the gaps

```
/inbox
```

The Receptionist reads everything and drafts everything. JR reads and sends. This is the highest ratio of value to effort in the whole system, because a customer email that sits for three days while he is on a pharmacy shift is a refund request later.

## Friday, 10 minutes

```
/brief
```

Did the thing that mattered on Monday get done? If not, that is the only question worth answering, and the answer is usually about time rather than about the plan.

---

## What each agent needs from JR, and nothing more

The fleet is designed so that JR is never the bottleneck on thinking, only on decisions and on filming.

| Agent | What it needs | How long |
|---|---|---|
| The Ledger | nothing | 0 |
| The Architect | approval on each change, and his own clicks in Shopify settings | 20 min once |
| The Chemist | **the Elite Starter Pack contents, once** | 2 min, worth having done a year ago |
| Scout | a film date | 5 seconds |
| The Voice | the day's plan in one line, and how the swirl is coming | 30 seconds |
| The Professor | a yes or no on any technique claim it could not source | 2 min |
| The Postman | approval on copy, and paste into Klaviyo | 15 min |
| The Mailman | pay, and pack | the unavoidable part |
| The Receptionist | read and send | 10 min |
| The Closer | do not spend yet | 0 |

---

## The failure mode to watch for

This exact system has already failed once, quietly, and it is worth naming so it is recognisable the second time.

It did not fail by producing bad work. It failed by producing **good work that nobody acted on.** Scout ran five weekly reviews in a row about the fact that there was nothing to review. Eleven proposals aged out. Sound picks expired unposted, including one called correctly at 83k that went on to 5x.

The tell is always the same shape: **analysis volume goes up while decisions go down.** If a week produces three documents and zero decisions, the system is failing even though it looks busy.

The guards against it are built in:
- `tools/queue.mjs` refuses to let proposals pile up silently past 5
- `tools/post.mjs` says the dry streak out loud in weeks
- `tools/brief.mjs` leads with what is blocked, not with what was produced
- Every agent is told to ask for a decision, not to add to a backlog

---

## Where this is going

The point of the fleet is not to run The Wave Plug at £2.4k a month more efficiently. It is to make £20k a month possible for someone with three days a week and no team.

The order it happens in:

1. **Stop the leak.** Checkout and currency. This is the whole game right now and it is worth more than everything else combined.
2. **Turn on the assets already owned.** An email list that has never been sent a campaign. 488 abandoned checkouts a quarter that nobody retargets. A 190k audience being sent to a store that quotes them in the wrong currency.
3. **Land the brushes properly.** The biggest revenue event in the brand's history, into a funnel that works, to a list that has been warmed.
4. **Then buy traffic**, once a pound in reliably returns more than a pound.
5. **Build the library.** The store is the business. The definitive body of wave knowledge is what makes JR the name the culture is built on, and nobody can copy it off him.
