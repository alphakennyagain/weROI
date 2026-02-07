# weROI - Lead Generation Agency Platform PRD

## Original Problem Statement
Build a premium, high-conversion lead generation website for weROI with a Lead Magnet funnel strategy. The website should capture leads through a multi-step audit form and an exit-intent popup for guide downloads, with automated email sequences.

## Core Requirements (Completed ✅)

### 1. Primary Hook - Free AI Growth Audit
- All CTAs changed to "Claim Your Free AI Growth Audit"
- Multi-step premium form (5 steps):
  1. Name
  2. Phone
  3. Email
  4. Company Name
  5. How did you find us?
- Progress bar at top showing completion
- Touch-friendly inputs for mobile
- Data stored in MongoDB `audit_leads` collection

### 2. Exit-Intent Capture - The Guide
- Popup triggers when mouse leaves window top (after 5s delay)
- Headline: "Don't leave your growth to chance."
- Subtext: "Download our Custom Tailored Guide to Scale your Business ($0 to $1M Blueprint)"
- 3D animated book mockup
- Fields: Name and Email only
- Data stored in MongoDB `guide_leads` collection

### 3. Email Automation (Resend)
- **Email 1 (Immediate)**: "Your Scaling Blueprint has arrived" - PDF delivery
- **Email 2 (24h later)**: "Why DIY scaling usually fails..." - Value add + CTA
- **Email 3 (48h later)**: "A custom roadmap for [Company]?" - Hard pivot + limited spots

### 4. Site Structure
- **Trust Ticker**: Slow-scrolling bar below hero with: Measurable AI Growth, Bespoke Scaling Systems, Automated ROI Architecture
- **What We Do**: Interactive service cards with expand on hover, blur background, "Learn More" ghost button
- **How We Work**: Align → Diagnose → Design → Deliver process framework
- **Ultra-Minimal Footer**: Logo, copyright, single "Claim Your Free Audit" CTA

### 5. Thank You Page
- Video placeholder with "Coming Soon" badge
- "While you wait, watch how we implemented these exact steps for a client last month"
- What's Next section with email sequence preview
- CTA to skip ahead and claim audit

## Tech Stack
- **Frontend:** React, React Router, TailwindCSS
- **Backend:** FastAPI, Motor (async MongoDB), Resend
- **Database:** MongoDB
- **Email:** Resend API

## Architecture
```
/app
├── frontend/
│   └── src/components/
│       ├── Home.jsx           # Homepage with Trust Ticker, interactive cards
│       ├── AuditForm.jsx      # 5-step multi-step form
│       ├── ExitIntentPopup.jsx # Exit intent with 3D book
│       ├── ThankYou.jsx       # Video placeholder page
│       ├── StrugglingToScale.jsx # PDF landing page
│       ├── GrowthSurvey.jsx   # Alternative survey flow
│       └── BookCall.jsx       # Calendly integration
└── backend/
    └── server.py              # Lead APIs + email automation
```

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads/audit` | POST | Submit audit form lead |
| `/api/leads/audit` | GET | List all audit leads |
| `/api/leads/guide` | POST | Submit guide download lead (triggers email sequence) |
| `/api/leads/guide` | GET | List all guide leads |
| `/api/leads/stats` | GET | Get lead counts and recent leads |
| `/api/emails/process-scheduled` | POST | Process scheduled emails (Email 2 & 3) |

## Database Schema

### `audit_leads` Collection
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "email": "email",
  "company_name": "string",
  "how_found_us": "string",
  "created_at": "datetime",
  "status": "new|contacted|qualified|converted"
}
```

### `guide_leads` Collection
```json
{
  "id": "uuid",
  "name": "string",
  "email": "email",
  "created_at": "datetime",
  "email_1_sent": "boolean",
  "email_2_sent": "boolean",
  "email_3_sent": "boolean",
  "email_2_scheduled_for": "datetime",
  "email_3_scheduled_for": "datetime"
}
```

## How to Access Your Leads

### Option 1: API Dashboard (Simple)
Access your leads via the API endpoints:
```bash
# Get all audit leads
curl https://your-domain.com/api/leads/audit

# Get all guide leads  
curl https://your-domain.com/api/leads/guide

# Get stats overview
curl https://your-domain.com/api/leads/stats
```

### Option 2: MongoDB Direct Access
Connect to MongoDB using any MongoDB client (MongoDB Compass, Studio 3T, etc.):
- **Connection String:** `mongodb://localhost:27017`
- **Database:** `test_database`
- **Collections:** `audit_leads`, `guide_leads`

### Option 3: Build Admin Dashboard (Recommended for Production)
Create a protected `/admin` route with:
- Lead list table with sorting/filtering
- Lead details view
- Export to CSV functionality
- Lead status management

## Email Automation Setup

### Required Configuration
Add your Resend API key to `backend/.env`:
```
RESEND_API_KEY=re_your_actual_api_key
SENDER_EMAIL=hello@yourdomain.com
```

### Get Resend API Key
1. Go to https://resend.com
2. Sign up / Log in
3. Go to API Keys → Create API Key
4. Copy key and add to `.env`
5. Verify your sending domain in Resend dashboard

### Process Scheduled Emails
Set up a cron job or call this endpoint periodically:
```bash
# Process emails due for sending (Email 2 at 24h, Email 3 at 48h)
curl -X POST https://your-domain.com/api/emails/process-scheduled
```

## Routes
| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/audit` | 5-step audit form |
| `/thank-you` | Thank you page (type=audit or type=guide) |
| `/struggling-to-scale` | PDF landing page |
| `/growth-survey` | Alternative survey flow |
| `/book-call` | Calendly booking page |

## Testing Status
- ✅ Backend: 100% (13/13 tests passed)
- ✅ Frontend: 100%
- ✅ Mobile responsive verified

## What's Implemented ✅
- [x] "Claim Your Free AI Growth Audit" CTAs throughout
- [x] 5-step multi-step audit form with validation
- [x] Progress bar and step indicators
- [x] Trust Ticker with animated scroll
- [x] Interactive service cards (expand, blur, ghost button)
- [x] Exit-intent popup with 3D book mockup
- [x] Thank you page with video placeholder
- [x] MongoDB lead storage
- [x] Resend email integration (3-email sequence)
- [x] Ultra-minimal footer
- [x] Mobile-optimized experience
- [x] All glow transitions on button hover

## Notes
- **Resend API Key:** Currently using placeholder. Add real key for email automation.
- **Exit Intent:** Only triggers once per session (uses sessionStorage)
- **Video Placeholder:** Ready for YouTube/Vimeo embed when video is ready

## Backlog / Future Tasks
- [ ] Admin dashboard for lead management
- [ ] CSV export functionality
- [ ] Lead scoring system
- [ ] A/B testing for form variations
- [ ] Google Analytics integration
- [ ] Add actual case study video
