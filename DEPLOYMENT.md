# weROI Deployment Guide

## Architecture

| Layer | Host | Notes |
|-------|------|-------|
| Frontend (CRA) | **Vercel** | `frontend/` — static React build |
| Backend (FastAPI) | **Railway / Render / Fly.io** | `backend/server.py` — needs MongoDB + env vars |
| Email | **Resend** | Transactional email from `growth@weroi.net` |
| Database | **MongoDB Atlas** | Connection string in `MONGO_URL` |

---

## 1. Resend Setup (weroi.net)

### Create API key
1. Sign in at [resend.com](https://resend.com)
2. Go to **API Keys** → Create key → copy to `RESEND_API_KEY`

### Verify domain
1. Go to **Domains** → Add Domain → `weroi.net`
2. Add the DNS records Resend provides to your domain registrar:

| Type | Name | Value |
|------|------|-------|
| TXT | `@` or `weroi.net` | SPF record (Resend provides) |
| CNAME | `resend._domainkey` | DKIM (Resend provides) |
| CNAME | `resend2._domainkey` | DKIM (Resend provides) |

3. Wait for verification (usually a few minutes)
4. Set `SENDER_EMAIL=growth@weroi.net` in backend `.env`

> **Important:** Do not send from `@gmail.com` — Resend requires a verified custom domain.

### Deliverability checklist
- From name: `weROI <growth@weroi.net>`
- Plain-text alternative included on all templates
- `reply_to` set to `growth@weroi.net`
- List-Unsubscribe headers on drip sequence emails (guide funnel)
- Avoid spam trigger words in subject lines

---

## 2. Backend Deployment

### Environment variables

```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/weroi
DB_NAME=weroi
RESEND_API_KEY=re_xxxxxxxx
SENDER_EMAIL=growth@weroi.net
ADMIN_EMAIL=contact.weroi@gmail.com
ADMIN_PASSWORD=your-secure-password
CORS_ORIGINS=https://weroi.net,https://www.weroi.net,https://your-vercel-app.vercel.app
```

### Railway (recommended)
1. Connect GitHub repo
2. Set root directory to `backend`
3. Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. Add all env vars above
5. Copy the public URL (e.g. `https://weroi-api.up.railway.app`)

### Render
1. New Web Service → Python
2. Build: `pip install -r requirements.txt`
3. Start: `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. Add env vars

---

## 3. Frontend Deployment (Vercel)

### One-time setup
1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Set **Root Directory** to `frontend`
4. Framework preset: **Create React App** (auto-detected)
5. `vercel.json` is included for SPA routing

### Environment variables (Vercel dashboard → Settings → Environment Variables)

| Variable | Value |
|----------|-------|
| `REACT_APP_BACKEND_URL` | Your production backend URL (no trailing slash) |

> Rebuild after changing env vars — CRA bakes them in at build time.

### Deploy
```bash
cd frontend
npm run build   # verify locally first
npx vercel --prod
```

Or connect GitHub for automatic deploys on push.

---

## 4. Connect weroi.net Domain (Vercel)

### Add domain in Vercel
1. Project → **Settings** → **Domains**
2. Add `weroi.net` and `www.weroi.net`

### DNS records (at your registrar — e.g. Namecheap, Cloudflare, GoDaddy)

**Option A — Vercel nameservers (simplest)**
Point your domain's nameservers to Vercel's (shown in the Domains panel).

**Option B — Keep existing DNS**

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

For `www` redirect: Vercel auto-redirects `www` → apex or vice versa based on your preference.

### Backend CORS
After domain is live, add `https://weroi.net` to `CORS_ORIGINS` on the backend and redeploy.

---

## 5. Email Templates

All templates live in `backend/email_templates.py`.

| Template | Trigger | Recipient |
|----------|---------|-----------|
| Audit confirmation | `/api/leads/audit` submit | Client |
| Growth audit snapshot | `/api/leads/audit` submit | Client |
| Owner notification | `/api/leads/audit` submit | `ADMIN_EMAIL` |
| Guide email 1 (blueprint) | `/api/leads/guide` submit | Client |
| Guide email 2 (Anti-DIY) | 24h after email 1 | Client |
| Guide email 3 (audit CTA) | 48h after email 1 | Client |

### Test templates locally
```bash
cd backend
python -c "from email_templates import get_growth_audit_email; e=get_growth_audit_email('Jane','Acme Co',['SEO','Funnels'],'1-3 months'); print(e['subject']); open('preview.html','w').write(e['html'])"
```

### Test sending (with valid API key)
Submit the audit form at `https://weroi.net/audit` or POST to `/api/leads/audit`.

---

## 6. Forms Wired to Backend

| Form | Endpoint | Emails |
|------|----------|--------|
| Audit form (`/audit`) | `POST /api/leads/audit` | Confirmation + growth snapshot + owner alert |
| Exit intent popup | `POST /api/leads/guide` | 3-email drip sequence |
| Book call (`/book-call`) | Calendly embed only — no backend submit |
| Growth survey (`/growth-survey`) | Session storage only — routes to guide page |

---

## 7. Local Development

```bash
# Backend
cd backend
cp .env.example .env   # fill in values
pip install -r requirements.txt
uvicorn server:app --reload --port 8000

# Frontend
cd frontend
cp .env.example .env
# Set REACT_APP_BACKEND_URL=http://localhost:8000
npm start
```
