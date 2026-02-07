# weROI - Lead Generation Platform PRD (Updated Feb 7, 2025)

## Original Problem Statement
Build a premium, high-conversion lead generation website for weROI with multi-step audit forms, exit-intent popups, email automation, and admin dashboard.

## ✅ All Requirements Completed

### Phase 1: Initial Website & Lead Funnel
- ✅ Premium dark-themed "Luxury Tech" website
- ✅ Multi-step AI Growth Audit form (6 steps including website/business page)
- ✅ Exit-intent popup for guide downloads
- ✅ Thank You page with video placeholder
- ✅ Trust Ticker with animated scroll
- ✅ Interactive service cards

### Phase 2: Email Automation (FULLY AUTOMATIC)
- ✅ Resend API integration from `growth@weroi.net`
- ✅ **Email 1 (Immediate)**: "Your Scaling Blueprint Has Arrived" with personalized PDF
- ✅ **Email 2 (24h later)**: "Why DIY Scaling Usually Fails" with Anti-DIY Framework - **AUTO-SENT**
- ✅ **Email 3 (48h later)**: "A Custom Roadmap for [Company]?" - **AUTO-SENT**
- ✅ Audit confirmation email with Calendly booking link
- ✅ **Built-in APScheduler** runs every 15 minutes to process follow-up emails

### Phase 3: Admin Dashboard (Feb 7, 2025)
- ✅ Password-protected at `/admin-dashboard`
- ✅ **Password**: `TylerandZach2025!`
- ✅ **Stats Overview**: Unique Visitors, Audit Leads, Guide Downloads, Total Leads
- ✅ **Lead Log Tab**: Full table with Edit/Delete per lead, Website column
- ✅ **Analytics Tab**: Conversion Funnels (Audit Form, Popup Capture)
- ✅ **Sources Tab**: Top Referrers with traffic source data
- ✅ **CRUD Operations**: Edit leads, Delete single leads, Clear All by type
- ✅ **CSV Export**: Download all leads (includes website field)
- ✅ **Mobile Responsive**: Works at 375px width

### Phase 4: Enhanced Analytics Tracking (Feb 7, 2025)
- ✅ Session-based unique visitor tracking
- ✅ `audit_form_start` event tracking when form loads
- ✅ `popup_shown` event tracking when exit popup appears
- ✅ `page_view` tracking on Home page
- ✅ `document.referrer` capture for source attribution
- ✅ Conversion rate calculations (form views → submissions)

## Architecture
```
/app
├── frontend/
│   └── src/components/
│       ├── Home.jsx           # Homepage with analytics tracking
│       ├── AuditForm.jsx      # 6-step form (now includes website field)
│       ├── ExitIntentPopup.jsx # Popup with popup_shown tracking
│       ├── ThankYou.jsx       # Post-submission page
│       └── AdminDashboard.jsx # Full CRUD admin with analytics
└── backend/
    └── server.py              # All APIs, email, admin, analytics + APScheduler
```

## Email Sequence Timeline
| Email | Trigger | Content |
|-------|---------|---------|
| Email 1 | Immediate on guide download | Growth Guide PDF delivery |
| Email 2 | 24 hours after Email 1 | Anti-DIY Framework |
| Email 3 | 48 hours after Email 1 | Custom Roadmap CTA |
| Audit Confirmation | Immediate on audit form | Calendly booking link |

**Note:** Emails 2 & 3 are processed automatically by the built-in scheduler every 15 minutes.

## API Endpoints

### Leads
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads/audit` | POST | Submit audit form (includes website) |
| `/api/leads/audit` | GET | List audit leads |
| `/api/leads/audit/{id}` | PUT | Update audit lead |
| `/api/leads/audit/{id}` | DELETE | Delete audit lead |
| `/api/leads/guide` | POST | Submit guide download |
| `/api/leads/guide` | GET | List guide leads |
| `/api/leads/guide/{id}` | PUT | Update guide lead |
| `/api/leads/guide/{id}` | DELETE | Delete guide lead |
| `/api/leads/clear-all` | DELETE | Clear all leads by type |
| `/api/leads/export/csv` | GET | Download all leads as CSV |

### Admin
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/auth` | POST | Authenticate |
| `/api/admin/dashboard-data` | GET | Get all dashboard data |

### Analytics
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/event` | POST | Track events |
| `/api/analytics/stats` | GET | Get conversion stats |

### Email (Manual trigger if needed)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/emails/process-scheduled` | POST | Manually process scheduled emails |

## Important Credentials
- **Admin Password**: `TylerandZach2025!`
- **Admin URL**: `/admin-dashboard`
- **Sender Email**: `growth@weroi.net`

## Audit Form Fields (6 Steps)
1. Name
2. Phone
3. Email
4. Company Name
5. Website / Business Page (optional)
6. How did you find us?

## What's Implemented
- [x] Premium "Luxury Tech" dark theme
- [x] 6-step audit form with website field
- [x] Dual-trigger exit-intent popup
- [x] MongoDB lead storage with full CRUD
- [x] Resend 4-email automation sequence
- [x] **APScheduler for automatic Email 2 & 3 delivery**
- [x] Admin dashboard with stats, leads, analytics, sources
- [x] Website column in leads table (clickable links)
- [x] Session-based visitor tracking
- [x] CSV export with website field
- [x] Mobile-optimized admin UI

## Backlog (P1-P2)
- [ ] Integrate real case study video on Thank You page
- [ ] Google Analytics integration for robust tracking
