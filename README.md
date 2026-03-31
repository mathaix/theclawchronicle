# 🦞 The Claw Chronicle

> *"The most exciting piece of technology I have seen since the web browser in 1992."*
> — Jensen Huang, NVIDIA GTC, March 16, 2026

A newspaper-style historical retrospective of the rise of [OpenClaw](https://openclaw.ai) — from a Vienna hacker's WhatsApp bot to the most-starred project in GitHub history.

**Live:** [theclawchronicle.com](https://theclawchronicle.com)

---

## What is this?

A single-page broadsheet-style HTML newspaper covering the full OpenClaw story across nine chapters:

1. **The Lore of Claw** — Warelay → Clawd → Molty is born (Nov 2025)
2. **The Moltbook Era** — Early experiments, directory dumps, robot shopping
3. **The Great Molt** — Anthropic trademark email, 5am Discord chaos, ClawdBot → OpenClaw
4. **Pete Joins OpenAI** — The announcement heard round the internet (5.6M views)
5. **The Mac Mini Gold Rush** — $600 machines flying off shelves worldwide
6. **Pop Culture: Beezy Gets Some Mins** — The lobster escapes the developer underground
7. **Clawmania: Meetups Worldwide** — SF madness, Tokyo, KL, and beyond
8. **The GitHub Phenomenon** — OpenClaw surpasses React, then Linux
9. **Jensen at GTC** — "Every software company needs an OpenClaw strategy"

Researched live from [@steipete](https://x.com/steipete)'s X timeline and the [OpenClaw lore docs](https://docs.openclaw.ai/start/lore).
Written entirely by AI agents (Claude Sonnet 4.6 / Molty 🦞).

---

## Contributing

Pull requests welcome. Ideas:

- **New chapters** as OpenClaw history continues
- **Translations** — the lobster is global
- **More photos** — add images to the relevant chapter with a caption
- **Corrections** — if a date or fact is wrong, fix it
- **Design improvements** — typography, layout, print stylesheet

To add a new chapter, follow the existing pattern in `index.html` — each chapter uses `.chapter-head`, `.section-hed`, `.body-text`, and optional `.pull-quote` and `.photo-block` elements.

---

## Tech

- Pure HTML + CSS + vanilla JS
- No frameworks, no build step, no dependencies
- One file (`index.html`) + two images
- Selective colour effect: lobsters stay orange, everything else goes B&W (Canvas API, pixel-by-pixel)
- Fonts: UnifrakturMaguntia, Playfair Display, IM Fell English, Libre Baskerville (Google Fonts)
- Hosted on GitHub Pages with custom domain

---

## License

MIT — fork it, remix it, print it, yee-claw it.

*The claw is the law. 🦞*
