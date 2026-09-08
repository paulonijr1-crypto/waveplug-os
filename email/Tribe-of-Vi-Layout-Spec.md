# Tribe of Vi layout — reverse engineered
Source: "It's deeper than just hair", Vi Tribe <support@tribeofvi.com>, 6 Feb 2026. Forwarded by JR 10/08/2026.

## The headline finding
**Their emails contain no live text.** The entire body is a stack of full-width images. The only real text is the legal footer.

They design the whole email as one tall graphic (Canva/Figma/Photoshop), slice it into horizontal strips, and stack the strips as image blocks with zero padding so they read as one continuous design.

## Exact structure

| # | Block | Detail |
|---|---|---|
| — | Preview text | "Trusted by thousands of happy customers" (hidden preheader) |
| 1–7 | Image blocks | 600px wide, full width, **each hyperlinked** to the site |
| 8 | Image block | 600px wide, **not** linked (sign-off//closing graphic) |
| 9 | Social block | **Instagram only**, 32px icon, centred, 9px padding |
| 10 | Footer text | "No longer want to receive these emails? Unsubscribe." + "Vi Tribe, Raven Road London, E18 1HB" |

## Styling
- **Body background:** `#F5F5F7` (very light grey, not white)
- **Content width:** 600px
- **Padding between image blocks:** `0px` — this is what makes it look like one seamless design
- **Footer font:** Helvetica/Arial, 12px, `#727272`, centred, line-height 1.3
- **Link colour:** `#49A0E7`
- **No buttons.** The "buttons" are drawn inside the images; the whole image is the click target.
- **No product blocks.** No dynamic Klaviyo content at all.

## How to build it in Klaviyo
1. Design the full email as one tall image, 600px wide (Canva: custom size 600 x whatever).
2. Export, then slice into 6–8 horizontal sections.
3. In Klaviyo: new email, set background `#F5F5F7`, content width 600px.
4. Add an **Image block** per slice. Set block padding to **0** top/bottom/left/right on every one.
5. Link each image to the relevant page (product, collection, homepage).
6. Add a Social block with Instagram only.
7. Klaviyo adds the footer automatically.
8. Save as a template and reuse — only the images change each send.

---

## ⚠️ Honest trade-offs before copying this

**Image-only emails are a known spam-filter risk, not a fix for one.** Filters can't read images, so they judge on the text-to-image ratio. An email that's 100% image with one line of footer text is a classic spam signal. Tribe of Vi get away with it because they have an established sending reputation and a big warm list. JR does not have that yet, and his deliverability is already soft (83.8% and 90% delivery on two flows).

**Images are blocked by default in many clients.** Outlook and plenty of Gmail users see nothing but empty boxes and the alt text. Their email has no alt text at all, so those readers see a blank email.

**It kills the personal voice.** JR's whole equity is that emails feel like they're from him. A polished sliced graphic reads as a brand broadcast, which is the opposite of "Yo, JR here".

**It's slow to produce.** Every email needs a design session. Fine for a brand with a designer, heavy for a solo founder working pharmacy shifts.

## Recommended middle ground (gets the look, keeps deliverability)
- **One designed image at the top** as a header/hero (600px, sliced if needed) — gets the premium first impression.
- **Live text for the body copy** in JR's voice — keeps the text-to-image ratio healthy, keeps it personal, readable with images off.
- **One real button** rather than a drawn one.
- Background `#F5F5F7`, 600px width, Instagram-only social block, matching their finish.
- Add **alt text on every image**.

This gets ~80% of the Tribe of Vi look at ~20% of the production time, without betting his deliverability on an image-only send.
