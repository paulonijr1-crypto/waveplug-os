---
description: Pick the sound for the next video. Two gate system over a Tokchart export.
---

**Before anything else, ask JR one question: are you actually posting this week, and on what day?**

If the answer is no, do not run a trend hunt. Give him the evergreen bench and stop. Scout's own log records five straight weeks of shortlists that were never posted, and stacking more is pure waste.

If there is a film date:
1. Save any CSV JR provides to `data/tokchart/trending-songs-<MARKET>-<YYYY-MM-DD>.csv` before analysing it. Rule SC-12, the one true acceleration diff this system ever ran used a file that was never retained.
2. Run `node tools/sound-score.mjs` for the board and the acceleration diff.
3. Spawn **Scout** (`tokchart-sound-analyst`) to apply the vibe gate, the ear test and the judgement the tool cannot make.
4. Hand the winning pick to **The Voice** for the creative.

Remember the rule Love Me forced: zones price the anchor game only, they are not a gate. Vibe first, position second.
