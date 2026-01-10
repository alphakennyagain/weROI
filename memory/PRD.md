# weROI - Marketing Website PRD

## Original Problem Statement
Build a premium, dark-mode marketing website for "weROI" - a business that helps brands track, scale, and optimize real ROI through smart digital systems.

## Core Requirements
- Premium dark-themed website with neon green (#DAFF01) accents
- Animated "weROI" logo with growth effect
- Homepage with Hero, Services, Authority (count-up stats), and CTA sections
- `/book-call` page with lead qualification form + Calendly widget
- Form answers passed to Calendly as URL parameters
- SEO & social media preview metadata configured

## Tech Stack
- **Frontend:** React, React Router, TailwindCSS
- **Styling:** Custom CSS animations, dark theme
- **3rd Party:** Calendly (react-calendly package)
- **Backend:** None (frontend-only application)

## Architecture
```
/app/frontend
├── public/
│   ├── index.html       # SEO metadata, OG tags
│   ├── og-image.png     # Social preview (1200x630)
│   ├── favicon.ico      # Tab icon
│   ├── logo192.png      # PWA icon
│   └── manifest.json    # PWA manifest
└── src/
    ├── components/
    │   ├── Home.jsx     # Landing page
    │   └── BookCall.jsx # Qualification form + Calendly
    ├── App.js           # Routes (/, /book-call)
    └── App.css          # All custom styles
```

## What's Implemented ✅
- [x] Premium dark theme with neon green accents
- [x] Animated "weROI" logo (ROI overlaps "we" with glow effect)
- [x] Animated TrendingUp icon next to logo
- [x] Homepage sections: Hero, Services, Authority (count-up stats), CTA
- [x] `/book-call` qualification form (2 questions)
- [x] Calendly widget with date filtering based on readiness answer
- [x] Form answers passed to Calendly (a1, a2 URL params + prefill)
- [x] SEO metadata (title, description, keywords)
- [x] Open Graph tags for Facebook/LinkedIn/WhatsApp
- [x] Twitter Card tags for X
- [x] Optimized OG image (1200x630)
- [x] Favicon and PWA manifest

## Deployment Checklist ✅
- [x] All routes return 200
- [x] Static assets accessible
- [x] OG image dimensions optimized
- [x] Favicon created
- [x] manifest.json created
- [x] SEO metadata configured

## Important Notes
- **Calendly URL:** `https://calendly.com/contact-weroi/30min`
- **Custom Questions:** User must configure `a1` and `a2` as custom questions in Calendly settings to see the form answers in meeting details
- **Social Preview:** OG image will only show after deployment to production URL (https://weroi.net/)

## Backlog / Future Tasks
- [ ] Backend integration (if data persistence needed)
- [ ] Contact form (currently only Calendly booking)
- [ ] Analytics integration
