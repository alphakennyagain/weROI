# Zachary Hutton — Personal Portfolio

A **distinctive** personal brand site for Zachary Hutton — CS student, full-stack builder, and security-minded engineer. Lives inside the [weROI](https://weroi.net) monorepo as a self-contained Next.js app, deployed separately on Vercel.

## Design rationale

This portfolio intentionally **does not** mirror common dev-portfolio templates (centered dark hero + pill tags + uniform card grid + blue-violet accents). The visual direction is **forest + amber** with editorial asymmetry.

| Choice | Rationale |
|--------|-----------|
| **Syne + IBM Plex** | Geometric display + technical body/mono — avoids overused Instrument Serif + DM Sans pairings |
| **Forest `#0a100c` + amber `#e8a849` + coral `#e07050`** | Warm, grounded palette — not blue-violet/teal generic dev look |
| **Split hero** | Oversized left-aligned name typography + right narrative column — not centered Kymani-style hero |
| **Skills marquee** | Infinite horizontal scroll of categorized skills — not a 6-column card grid clone |
| **Asymmetric bento grid** | Featured projects span 2×2; mixed wide/tall cells — not uniform 3-col cards |
| **About split** | Editorial headline left, prose right, horizontal stats strip — not stat card grid |
| **Cyber terminal panel** | Scroll-triggered typing animation in a faux Kali terminal — memorable security differentiator |
| **Resources deck** | Stacked, rotated link cards that fan on hover — not a flat 2-col link grid |
| **Film grain + mesh gradients** | Atmosphere and depth without purple gradient slop |

### Section order

`Hero → Skills marquee → Bento projects → About → Cyber terminal → Resources deck → Experience → Contact`

Spotlight carousel removed — projects speak for themselves in the bento grid.

### Brand positioning

Multi-pillar CS/engineering identity — **not** a weROI brochure:

1. **Programming & CS** — UTech coursework and labs
2. **Personal projects** — GitHub experiments and tools
3. **Cybersecurity** — security-aware engineering (terminal section)
4. **Professional delivery** — weROI + freelance (one pillar among several)
5. **Resources hub** — curated tools and learning links

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (section reveals, hero entrance)

## Content structure

```
content/
  profile.ts          # Hero, about, contact
  skills.ts           # 6 categories (rendered as marquee)
  projects/           # personal · coursework · professional
  cybersecurity.ts    # Terminal section content
  resources.ts        # Curated docs, tools, communities
  experience.ts       # Timeline
```

## Commands

```bash
cd portfolio
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

## Deploy (Vercel)

1. Import [github.com/zacharyahutton/portfolio](https://github.com/zacharyahutton/portfolio) in Vercel — **no root directory override** (this repo is the portfolio app only).
2. Framework preset: **Next.js**. Build command: `npm run build`. Output: default.
3. **Environment variables:** none required (static content site).
4. Resume: `public/resume.html` is live (print to PDF from the browser if needed). Optional: add `public/resume.pdf` for a direct download.
5. Optional: add `public/og-image.png` for social previews.

## Separation from weROI

| | `portfolio/` | `frontend/` (weROI) |
|---|---|---|
| Purpose | Personal brand | Agency marketing |
| Visual identity | Forest + amber, Syne | Agency lime brand |
| Deploy | Personal Vercel project | weROI production |
