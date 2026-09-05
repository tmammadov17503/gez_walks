# GƏZ Walks

[![Deploy GƏZ to GitHub Pages](https://github.com/tmammadov17503/gez_walks/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/tmammadov17503/gez_walks/actions/workflows/deploy-pages.yml)

GƏZ is an Azerbaijani-first dog-walking marketplace prototype for Baku. It helps owners create a warm dog profile, choose a trusted nearby walker, request a walk, follow a simulated live route, and receive a complete walk report.

## Live website

- GitHub Pages: `https://tmammadov17503.github.io/gez_walks/`
- OpenAI Sites: `https://gez-walks.mnazaxan.chatgpt.site`

## Prototype journeys

- AZ / EN / RU presentation
- Simulated phone OTP sign-in
- Dog profile creation and editing
- Six fictional walkers across Baku
- Date, time, duration and district filters
- Side-by-side comparison for two walkers, including price, experience and dog-size fit
- Saved favorite walkers with a favorites-only discovery filter
- Free meet-and-greet demo requests, with rescheduling and cancellation
- Walker profiles with dog-size compatibility checks
- Booking request and status simulation
- Optional “ready at the door” checklist before the walker arrives
- Live route, photo update and walk completion report
- Rating, history and repeat booking
- Mobile bottom navigation

No real payments, GPS, OTP delivery, or background-check integration are connected yet.

Favorites and meet-and-greet preferences are saved on the current device only. Meet requests do not send messages or confirm a real walker. Times use Baku time; past times and dates more than 30 days ahead are rejected. Only known walker IDs and the date/time fields are retained. If browser storage is blocked, the UI explains that changes last for the current visit only.

The opening screen, care and trust sections include restrained 3D paw imagery and hover depth. On precise-pointer devices the Baku architectural model and its live cards sit on separate perspective layers; touch devices receive the same composition without unnecessary transforms. Opening-screen motion can be paused, decorative images do not intercept input, and motion respects the reduced-motion setting.

Each requested demo walk freezes the selected walker, dog, schedule, duration and price so that its status, live route, report, rating and repeat booking remain internally consistent. The frozen snapshot excludes medical notes, emergency contacts and pickup instructions. Comparison choices and checklist ticks last only for the current visit.

## Local development

```bash
npm install
npm run dev
```

Build the standalone GitHub Pages version with:

```bash
npm run pages:build
```

## Checks

```bash
npm test
npm run lint
python tests/verify_gez_features.py
python tests/verify_gez_planning.py
python tests/verify_gez_responsive.py
```

The Python browser checks require Playwright and installed Chromium/WebKit engines. Pass `--browser webkit` or `--url <preview-url>` to test the other engine or a built preview.

## Generated artwork

`public/gez-paw-high-five.png` was created with the built-in image-generation tool. Its original transparent alpha channel is preserved. The existing `gez-dog-care-3d.webp` scene is reused in the trust section.

Final generation prompt:

```text
Use case: product-mockup
Asset type: a single decorative transparent raster accent for the premium, calm GƏZ dog-walking website, displayed at 140–300px as a paw peeking up from a section edge.
Scene/backdrop: TRUE transparent alpha background. No visible backdrop, checkerboard, floor, ground plane, rectangle, or environmental objects.
Subject: exactly one photorealistic golden retriever front paw with a short softly feathered foreleg, reaching upward in a gentle high-five pose. Three-quarter angle with some dark, soft paw pads visible. Natural, plausible canine anatomy. The foreleg continues naturally out of the bottom canvas edge, implying the rest of a healthy dog is below frame; never a detached limb.
Style/medium: refined photorealistic 3D product-CGI render, tactile honey-and-cream golden retriever fur with fine individual strands and soft pad texture; not cartoon or toy-like.
Composition/framing: approximately 1024 x 1024 square canvas, one large clear paw occupying the central 65–75% with generous safe space around the upper and side contour. Bottom of foreleg is naturally cropped by bottom canvas edge. Readable silhouette at small website sizes.
Lighting/mood: soft Baku-like daylight, beautifully restrained, warm, calm, premium.
Color palette: natural honey/cream fur and dark pads, designed to harmonize with warm milk #f6f1e7, deep moss #31483b, soft sage and subtle apricot website colors, while keeping the entire background truly transparent.
Constraints: one image only. No text, logo, watermark, accessories, extra limbs, detached/gory appearance, other objects, border, floor shadow, background rectangle, or fake transparency. Preserve fine fur-edge alpha transparency.
```
