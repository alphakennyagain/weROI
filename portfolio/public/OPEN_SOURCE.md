# Zachary Hutton Portfolio · Open Source

Personal portfolio site for Zachary Hutton. Lives in the [weROI monorepo](https://github.com/zacharyahutton/weROI) under the `portfolio/` folder and deploys separately on Vercel.

## Tech stack

| Layer | Tools |
|-------|-------|
| Framework | **Next.js 15** (App Router, Turbopack) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4**, obsidian design tokens |
| Animation | **Framer Motion**, **GSAP** (GooeyNav) |
| Icons | **lucide-react** |
| UI | shadcn-style components in `components/ui/` |
| Theming | **next-themes** (light/dark, localStorage) |

## Getting started

```bash
cd portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

## Folder structure

```
portfolio/
├── app/                  # Next.js App Router (layout, page, globals.css)
├── components/           # Page sections and layout
│   ├── ui/               # Reusable UI (marquee, project-card, TextType, etc.)
│   ├── Hero.tsx
│   ├── HeroVisual.tsx
│   ├── Spotlight.tsx     # Kymani-style highlight carousel
│   ├── Projects.tsx      # Full project grid
│   └── ...
├── content/              # Typed content modules (projects, profile, experience)
├── lib/utils.ts          # cn() helper and shared constants
├── public/               # Static assets (resume.html, case-study images)
├── brand/                # Resume source markdown
└── OPEN_SOURCE.md        # This file
```

## Component architecture

- **Content-driven**: project and profile data live in `content/*.ts` and are imported by section components.
- **Section components**: each major page block (`Hero`, `Spotlight`, `Projects`, etc.) is a self-contained React component with `SectionReveal` scroll animations.
- **UI primitives**: `components/ui/` holds shared pieces (`marquee`, `project-card`, `BlurText`, `TextType`, `GooeyNav`).
- **Design tokens**: CSS custom properties in `app/globals.css` (`--color-obsidian`, `--color-electric-indigo`, etc.) power the obsidian theme in both dark and light modes.

## Deploy

1. Link the `portfolio` directory as a Vercel project (root directory: `portfolio`).
2. Build command: `npm run build`
3. Output: Next.js default

Resume PDF: print `public/resume.html` to PDF and place as `public/resume.pdf` if needed.

## License

MIT. See the root weROI repository for full license terms.
