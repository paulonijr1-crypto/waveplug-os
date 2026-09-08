# The Wave Plug email layout — build spec
Modelled on Vi Tribe "Keeping Our Promise (something for you)", 3 Feb 2026.
This is the layout JR picked (10/08/2026). Build once in Klaviyo, save as a template, reuse for every send.

**Why this one and not their other emails:** their other sends ("It's deeper than just hair", "Hydration Comes First") are 100% stacked images with no live text. This one is the hybrid — real text with images around it. Better deliverability, readable with images off, and it suits JR's informational style.

---

## Global settings
| Setting | Value |
|---|---|
| Content width | **600px** |
| Background colour | **`#F9F8F6`** (warm off-white, not pure white) |
| Body font | **Arial** |
| Button/nav font | **Poppins** (fallback Helvetica, Arial) |
| Body text size | **18px**, line-height **1.5**, colour black |
| Text alignment | Headings centred, body copy left |

---

## Block order (top to bottom)

**1. Logo** — image block, centred, ~150–180px wide.

**2. Nav bar** — three small buttons in a row: `HOME` · `SHOP ALL` · `CONTACT`
- Font Poppins **12px**, weight 700, **letter-spacing 2px**, white text
- Padding **5px 17px**, border-radius **5px**
- Vi Tribe use sage green `#85A78E`. For The Wave Plug use black `#1A1A1A` or a brand colour.

**3. Hero image** — full 600px width, linked to the relevant page.

**4. Headline** — H1, **centred**, Arial.

**5. Body copy** — text block, 18px Arial, line-height 1.5, black. **This is where JR's voice goes.** Left-aligned reads better for longer copy.

**6. Offer line** — H4 centred, e.g. `10% OFF YOUR ORDER`

**7. Code line** — 22px Arial, `**Code:** WAVE10`

**8. Main button**
- Background **`#000000`**, text white
- Poppins **14px**, weight **600**, letter-spacing **1px**
- Padding **20px 50px**, border-radius **10px**
- Label: `SHOP NOW`

**9. "OUR RECOMMENDATIONS"** — H2, centred, Arial.

**10. Product grid** — Klaviyo product block. Vi Tribe show **6 products**: image, name, price. Pull from a collection so it updates itself.

**11. About block** — small heading `ABOUT THE WAVE PLUG`, then JR's approved brand line:

> A community driven brand built for all wavers, making the path to elite as easy and stress free as possible.

Longer version if the space needs filling:

> The Wave Plug is a community driven brand built for all wavers. Everything we make is about making your path to elite waves as easy and stress free as possible.

**Use this wording, don't rewrite it.** JR wrote it 10/08/2026. Note it says **all wavers**, not just 4C — 4C is where JR's story starts, but the brand speaks to everyone.

**12. Social block** — icons. **Add TikTok** (currently missing from JR's emails, and it's his main channel at 190k).

**13. Footer** — unsubscribe + business address. Helvetica 12px, `#727272`, centred.

---

## Colour reference
| Use | Hex |
|---|---|
| Background | `#F9F8F6` |
| Button / nav (Wave Plug) | `#000000` / `#1A1A1A` |
| Button text | `#FFFFFF` |
| Body text | `#000000` |
| Footer text | `#727272` |
| Vi Tribe's accent (for reference) | `#85A78E` sage green |

---

## Build order in Klaviyo
1. Campaigns → Create → start from blank drag-and-drop template.
2. Set global styles: 600px width, `#F9F8F6` background, Arial body 18px/1.5.
3. Add blocks in the order above.
4. Style the black button once — Klaviyo remembers it.
5. **Save as template** ("Wave Plug master layout"), then duplicate it for every future email.
6. Only the hero image, headline and body text change per send.

## Assets JR needs
- Logo on transparent background
- One hero image per email, 600px wide (Canva: custom size 600 x 400)
- Product images already exist in Shopify and pull in automatically via the product block

## Notes
- **Add alt text to every image.** Vi Tribe don't, which means anyone with images blocked sees nothing.
- Keep a real text-to-image balance. The reason this layout is safer than their image-only ones is that spam filters can actually read it.
- Nav bar links: Home → thewaveplug.com · Shop All → /collections/all-products · Contact → contact page.
