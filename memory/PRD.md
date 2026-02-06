# weROI - Premium Agency Platform PRD

## Original Problem Statement
Build a premium, dark-mode marketing website for "weROI" - a business that helps brands track, scale, and optimize real ROI through smart digital systems. The website was remodeled from a "Book a Call" CTA to a Lead Magnet funnel.

## Core Requirements (Completed ✅)

### Visual Language - Luxury Tech Aesthetic
- Premium dark theme (#111113) with neon green accents (#DAFF01)
- Glassmorphism effects on all cards
- Smooth scroll reveals and micro-interactions
- Animated grid background with gradient orbs
- Cursor glow effect
- High-impact headlines, concise copy

### Service Remodel - Three Pillars
1. **AI Audit & Transformation** - All-Star AI Growth Audit, Data Security, Agent Design, AI Transformation
2. **Growth Systems Applications** - Website Build, Branding, CRM Systems, Marketing, Content, Paid Ads/SEO  
3. **Scale Partnerships** - Revenue Partnership, Monthly Optimization, AI Maintenance, Strategic Partner

### Process Framework - All-Star AI Growth
- **ALIGN** - Meet stakeholders, gather artifacts → Executive Audit & Baseline Workbook
- **DIAGNOSE** - Deep dives across sales/marketing/delivery → Opportunity Map & Top 10 Inefficiencies
- **DESIGN** - Turn highest-value lever into testable hypothesis → Pilot Implementation Plan & ROI Workbook
- **DELIVER** - Execute pilot, validate, scale → Validated System & Scale Roadmap

### Conversion Funnel - Lead Magnet
1. **Homepage** - "Unlock Your Free Custom Growth Guide" CTA
2. **Survey Page** (`/growth-survey`) - 2 questions:
   - Primary growth bottleneck (6 options)
   - 12-month revenue goal with currency selector (USD/GBP/EUR/JMD/CAD/AUD)
3. **Landing Page** (`/struggling-to-scale`) - Content from PDF, embedded PDF viewer, sticky CTA
4. **Growth Audit Application** - Links to `/book-call` with Calendly

### Tone of Voice
- Authoritative, elite, ROI-obsessed
- "We engineer growth" not "We help"
- High-impact headlines: "We Engineer Revenue. You Own the System."

## Tech Stack
- **Frontend:** React, React Router, TailwindCSS
- **Styling:** Custom CSS animations, glassmorphism, dark theme
- **3rd Party:** Calendly (react-calendly), PDF embed via iframe
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
    │   ├── Home.jsx           # Homepage with 3 pillars & process
    │   ├── GrowthSurvey.jsx   # Lead capture survey (2 questions)
    │   ├── StrugglingToScale.jsx  # Landing page with PDF embed
    │   └── BookCall.jsx       # Calendly qualification form
    ├── App.js                 # Routes
    └── App.css                # All custom styles
```

## Routes
- `/` - Homepage
- `/growth-survey` - Lead capture survey
- `/struggling-to-scale` - PDF landing page with sticky CTA
- `/book-call` - Calendly qualification + booking

## What's Implemented ✅
- [x] Premium Luxury Tech dark theme with neon green accents
- [x] Animated "weROI" logo with growth effect
- [x] Three service pillars with detailed service lists
- [x] Align→Diagnose→Design→Deliver process section
- [x] Authority stats with count-up animation (127+ systems, 3.2x revenue, 94% retention)
- [x] About section with brand story
- [x] Results/testimonials section with ROI metrics
- [x] Lead magnet survey page with bottleneck + revenue questions
- [x] Currency selector (USD/GBP/EUR/JMD/CAD/AUD)
- [x] Struggling to Scale landing page
- [x] Embedded PDF viewer with download button
- [x] Sticky CTA bar "Ready to automate this? Apply for a Growth Audit"
- [x] Calendly integration with qualification form
- [x] Form answers passed to Calendly (a1, a2 parameters)
- [x] SEO metadata (title, description, keywords)
- [x] Open Graph tags for social previews
- [x] Optimized OG image (1200x630)
- [x] Favicon and PWA manifest
- [x] Glassmorphism effects throughout
- [x] Micro-interactions on all buttons and cards

## PDFs Used
- **WEROI GROWTH GUIDE.pdf** - Lead magnet download
- **Struggling-to-scale.pdf** - Content reference for landing page
- **Inspiration for weROI.pdf** - Service structure and framework reference

## Testing Status
- ✅ All frontend tests passed (100% success rate)
- ✅ Survey flow tested: Homepage → Survey → Landing Page → Book Call
- ✅ PDF embed and download verified
- ✅ Calendly integration verified
- ✅ All navigation links verified

## Important Notes
- **Calendly URL:** `https://calendly.com/contact-weroi/30min`
- **PDF URL:** `https://customer-assets.emergentagent.com/job_premium-scale-3/artifacts/xl4qmsi8_WEROI%20GROWTH%20GUIDE.pdf`
- **Custom Calendly Questions:** User should configure `a1` and `a2` in Calendly settings to capture form answers

## Backlog / Future Tasks
- [ ] Backend integration for lead data persistence
- [ ] Analytics integration (GA4, conversion tracking)
- [ ] A/B testing for CTA copy variations
- [ ] Case studies page with detailed ROI breakdowns
