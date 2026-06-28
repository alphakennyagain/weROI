# Zachary Hutton — Personal Portfolio

This folder is **Zachary Hutton's personal portfolio site** — a self-contained Next.js application living inside the [weROI](https://weroi.net) monorepo for convenience, but **completely separate** from the agency product.

## Separation from weROI

| | `portfolio/` (this app) | `frontend/` (weROI agency) |
|---|---|---|
| Purpose | Personal brand — CS student, projects, security, resources | weROI agency marketing site |
| Package manager | Own `package.json` + `package-lock.json` | Own dependencies |
| Build output | Own `.next/` in this folder | CRA build in `frontend/` |
| Deploy target | Personal Vercel project (e.g. `zachary-hutton.vercel.app`) | weROI production |

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (section reveals)

## Content structure

Typed content modules in `content/` — easy to extend as labs and projects grow:

```
content/
  profile.ts          # Hero, about, contact
  skills.ts           # 6-category skills grid
  spotlight.ts        # 3 mixed-pillar spotlight cards
  projects/           # personal · coursework · professional
  cybersecurity.ts    # Security focus section
  resources.ts        # Curated docs, tools, communities
  experience.ts       # Timeline
brand/
  resume-source.md    # Multi-pillar resume (export to PDF)
  LINKEDIN_COPY.md    # Aligned LinkedIn messaging
  GITHUB_PROFILE.md   # GitHub README draft
```

## Commands

```bash
cd portfolio
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

## Git ignore

Only `portfolio/node_modules/` and `portfolio/.next/` are gitignored (via root `.gitignore`). Source is committed to the weROI repo.

## Brand positioning

Multi-pillar CS/engineering identity — **not** a weROI brochure:

1. **Programming & CS** — UTech coursework and labs
2. **Personal projects** — GitHub experiments and tools
3. **Cybersecurity** — security-aware engineering
4. **Professional delivery** — weROI + freelance (one pillar among several)
5. **Resources hub** — curated tools and learning links

## Deploy (Vercel)

1. Create a new Vercel project pointing at this repo with **Root Directory** set to `portfolio`.
2. Add `resume.pdf` to `public/` before deploy.
3. Optional: add `public/og-image.png` for social previews.
