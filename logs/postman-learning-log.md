# Postman Learning Log — JR / The Wave Plug

**Baseline (audited 08/08/2026):** £1,095.95 email revenue in 12 months (~£91/month) = ~3% of store revenue. Target: 20–30%.

The Postman's memory. Read first every run, written back last. Local file only.

## Rewrites shipped
| Date | Flow/Campaign | What changed | Before (open/click/rev) | After | Verdict |
|---|---|---|---|---|---|
| — | (none yet) | — | — | — | — |

## JR's edits (his wording = the voice)
| Date | My copy | His version | Lesson |
|---|---|---|---|
| 2026-08-09 | "Yo — JR here. The Wave Plug is me, so you'll be hearing from me directly. Quick story before I send you anything else. Year 12. Waves were the hairstyle, everyone had them. Mine were trash. 4C hair, thin with it — the kind where..." | "Yo, Jr here. Quick story before i send you anything else. 2017 waves were the hairstyle. Mine were trashhh. 4c, waves thin, kind where you brush for weeks and the pattern still wont show up. I did everything the youtube videos was telling me to do and got nothing back, what i worked out was that most wave advice isnt written for our hair, its for medium texture where waves come easy." | **Cut the preamble** ("The Wave Plug is me…") — he gets straight in. Uses the **real year (2017)**, not "Year 12". **Stretched letters for emphasis** ("trashhh"). Lowercase "4c", lowercase "youtube". **Comma splices and run-on sentences** in the personal bits. Names the source specifically ("youtube videos"). Loose grammar is deliberate, don't correct it. |

### ⛔ HARD RULE — NO DASHES (JR, 09/08/2026)
"take away those dashes it gives ai". **Never use em dashes or en dashes in any email copy.** Use commas, full stops, or restructure the sentence. This applies to all copy for JR, everywhere.

### Voice split he revealed by what he kept vs rewrote
He **rewrote the personal/story opening** into loose spoken English, and **kept the educational paragraphs exactly as drafted** (cleaner prose, correct apostrophes). So: **story = his loose voice, teaching = clean and clear.** Don't loosen the instructional sections; do loosen anything about him.

**Signature:** `JR The Wave Plug` on one line. Not "JR / The Wave Plug", not "— JR".

## What works (subject lines, angles, CTAs)
| Pattern | Evidence |
|---|---|
| — | (none yet) | 

## Decisions
| Date | Decision | Reason |
|---|---|---|
| 2026-08-10 | **TEXT SWAPS ONLY. Do not build new templates or change layout.** JR reported the API-built template landed in spam. Work inside his existing emails, changing copy only. | JR's call. (Note for future: Klaviyo preview/test sends bypass normal sending reputation and hit spam far more than live sends, so the layout itself may not be the cause. Revisit only if JR raises it.) |
| 2026-08-10 | **The Klaviyo API cannot write to flow email content.** `update_dnd_email_template` returns 404 "does not exist" for templates attached to a flow, even though GET works. `update_flow` only changes status. So copy changes inside flows must be pasted by JR in the Klaviyo editor. Deliver paste-ready text, do not promise to write it in. | Verified 2026-08-10 on template `XfdwvK`. |
| 2026-08-10 | Discount code is **`WAVE10`** (already live in the welcome flow). Do NOT create WELCOME10 or any new code. | Found in existing welcome email 1. |
| 2026-08-08 | Priorities set: (1) rewrite existing flows in JR's voice, (2) build the October Torino-rival brush launch sequence. | JR's call. Flows already have traffic and dead click rates — fastest money. Torino launch is the flagship growth lever. |
| 2026-08-08 | Permissions: draft everything → JR approves in chat → then build in Klaviyo. Never send. | JR's call. |

## Open issues from the audit
- **CONFIRMED 08/08/2026 — duplicate welcome flows are real.** Both `RRVRYi` (Welcome Series - Customer v. Non-Customer, live, Feb 2026) and `Rtmdba` (AskTimmy | Welcome Flow, live, Mar 2026) trigger off the **same list: "Newsletter" (`Yfdjyf`)**. Every new Newsletter subscriber enters BOTH sequences at once — 2 emails from one, 4 from the other, overlapping. A third flow, `TzkXUR` "Welcome Series", also points at Newsletter but is in **draft** (harmless, but confusing — 3 welcome flows on one list).
- Recipient counts differ (186 vs 208) despite the same trigger, which fits `RRVRYi` having a customer/non-customer conditional split that filters part of the audience.
- Browse Abandonment `RpiWUD`: 321 sends, 1 click, £0. Rebuild or pause.
- Customer Thank You `TZcTPf`: 0% click rate across 169 sends.
- VIP Flow `YfHdr8` still in draft.
- Zero campaigns ever sent — list has never heard from JR directly.
- Deliverability soft on Browse Abandonment (83.8%) and Abandoned Checkout (~90%) — list hygiene.
- SMS Subscribers list exists, no SMS flows running.
- Conversion metric ID for all reporting: `TEdekd` (Placed Order).
