# WAVEPLUG OS

The Wave Plug, run as one system instead of a folder of documents.

JR is building the greatest wave brand there has been. This repo is the machinery underneath that: one shared brand brain, ten specialist agents, a state layer they all read from, and a small set of tools that turn judgement calls into numbers.

Everything that used to live in scattered CoWork tabs and folders is in here now, versioned, with the loose ends turned into things that can actually be run.

---

## Start here

```bash
node tools/brief.mjs
```

One screen. Where the money is, what is blocked, and the three things that matter this week.

---

## The map

| Path | What is in it |
|---|---|
| `CLAUDE.md` | **The brand brain.** Founder, business, products, wave knowledge, voice, platform rules, guardrails. Every agent reads this first. |
| `.claude/agents/` | The ten specialists. |
| `.claude/commands/` | Slash commands: `/brief` `/numbers` `/ship` `/inbox` `/sound` `/post` `/stock` `/site` `/parcels` `/launch` |
| `tools/` | The code layer. Node, no dependencies. |
| `state/` | Machine readable truth. KPIs, the approval queue, the post log, stock, the bill of materials. |
| `logs/` | One learning log per agent. Their memory across sessions. |
| `content/` | The Content Plug brain, the DITL engine, series files. |
| `growth/` | The revenue plan and the website audit. |
| `ops/` | Shipping queue, make list, dispatch logs. |
| `email/` | Klaviyo specs and drafts. |
| `docs/` | How a week runs, and the October launch playbook. |
| `data/tokchart/` | Retained Tokchart exports. Naming matters, see below. |

---

## The fleet

**Plug** is the overseer. Every session runs under Plug, which reads the brain, routes work, and enforces the guardrails.

| Agent | Owns |
|---|---|
| **Scout** | Sound selection, the two gate system |
| **The Voice** | Voiceovers, hooks, scripts, captions |
| **The Professor** | Wave education library, YouTube long form |
| **The Architect** | Website, checkout, currency, conversion |
| **The Postman** | Klaviyo, flows, campaigns |
| **The Closer** | Meta ads and paid acquisition |
| **The Ledger** | The numbers, weekly, honestly |
| **The Chemist** | Production, stock, the bill of materials |
| **The Mailman** | Parcels, Royal Mail labels, customs |
| **The Receptionist** | Inbox, customer service, drafts only |

Handoff rule: **Scout picks the sound, Plug hands it to The Voice, The Voice writes the creative.**

---

## The tools

| Command | What it does |
|---|---|
| `node tools/brief.mjs` | The morning brief across the whole fleet |
| `node tools/scoreboard.mjs` | Funnel, trend, what each fix is worth, the path to £20k |
| `node tools/queue.mjs` | The cross agent approval queue |
| `node tools/post.mjs` | The post log and the dry streak detector |
| `node tools/sound-score.mjs` | Scores a Tokchart export, diffs two for true acceleration |
| `node tools/make-list.mjs` | Explodes orders through the BOM into a make and source list |
| `node tools/parcels.mjs` | Flags parcels Royal Mail never scanned, before the customer asks |

Node 18+. No install step, no dependencies, nothing to build.

---

## Why the state layer exists

Three problems were quietly costing real money, and all three were invisible because they lived at the bottom of markdown files nobody re-read.

**1. The approval queue was 13 deep.** Scout had proposed 13 rule changes across five weekly reviews. None were approved or rejected, the oldest had been waiting 30 days, and Scout had started writing reviews about the fact that its reviews were pointless. `state/queue.json` and `tools/queue.mjs` turn that into one yes or no pass.

**2. The learning loop was open.** Five straight weeks with no posted video logged. Every rule Scout and The Voice run on is still untested against a real outcome, and the wins in the pattern library were back filled from memory rather than measured. `tools/post.mjs` closes it, and it says out loud how long the streak has been running.

**3. Nobody had written down what is in a bundle.** Shopify does not record bundle contents, so the make list was rebuilt by hand every time and the 5 September list had Triple Threat under STILL UNKNOWN. `state/bom.json` holds the recipes with a `confirmed` flag, and the tool refuses to pretend an inferred recipe is a known one.

The Elite Starter Pack is 40% of revenue and its contents are still not recorded anywhere. That is the single highest value five minutes available in this repo.

---

## Conventions worth keeping

- **Tokchart exports get retained.** `data/tokchart/trending-songs-<MARKET>-<YYYY-MM-DD>.csv`, saved before analysis, always. The only true acceleration diff this system ever ran used a file that was never kept.
- **KPI snapshots append, never overwrite.** The history is the asset.
- **An inferred BOM says it is inferred**, every time it is used.
- **No dashes in anything JR's name goes on.** His rule, and he is right that they read as AI.
