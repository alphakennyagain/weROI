# weROI Deployment Guide

## Architecture

| Layer | Host | Notes |
|-------|------|-------|
| Frontend (CRA) | **Vercel** | `frontend/` — static React build |
| Backend (FastAPI) | **Railway / Render / Fly.io** | `backend/server.py` — needs MongoDB + env vars |
| Email | **Resend** | Transactional email from `growth@weroi.net` |
| Database | **MongoDB Atlas** | Connection string in `MONGO_URL` (see [§2](#2-backend-deployment)) |

> **Note:** `backend/data/weroi.db` is a legacy SQLite file and is **not** used by the API. The backend is MongoDB-only; switching to SQLite would require rewriting all data access.

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
- Reply-To: `contact.weroi@gmail.com` (set `REPLY_TO_EMAIL` in Railway if different)
- Plain-text alternative included on all templates
- List-Unsubscribe headers on drip sequence emails (guide funnel)
- Avoid spam trigger words in subject lines ($ amounts, urgency, ALL CAPS)

### DNS records (add at your domain registrar)

| Type | Name | Purpose |
|------|------|---------|
| TXT | `@` | SPF — Resend provides the value |
| CNAME | `resend._domainkey` | DKIM |
| CNAME | `resend2._domainkey` | DKIM |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:contact.weroi@gmail.com` |

After domain verifies in Resend, add a **DMARC** record (start with `p=none`, move to `quarantine` once deliverability is stable). Optionally add a **BIMI** record later for brand logo in Gmail.

### Gmail inbox tips
- Ask new leads to drag the first email to Primary and click "Yes" when Gmail asks if they want future messages in Primary
- Keep `SENDER_EMAIL` on your verified domain (`growth@weroi.net`), never `@gmail.com`
- Transactional audit emails use Reply-To `contact.weroi@gmail.com` so replies land in your inbox

---

## 2. Backend Deployment

### Environment variables

```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/weroi
DB_NAME=weroi
RESEND_API_KEY=re_xxxxxxxx
SENDER_EMAIL=growth@weroi.net
REPLY_TO_EMAIL=contact.weroi@gmail.com
ADMIN_EMAIL=contact.weroi@gmail.com
ADMIN_PASSWORD=your-secure-production-password
CORS_ORIGINS=https://weroi.net,https://your-vercel-app.vercel.app
```

### Railway (recommended)

**Critical settings**

| Setting | Value |
|---------|-------|
| Root directory | `backend` |
| Start command | `uvicorn server:app --host 0.0.0.0 --port $PORT` |
| Health check path | `/api/health` |
| Python version | 3.12 (`runtime.txt`) |

**Deploy steps**

1. Connect GitHub repo in [Railway](https://railway.app)
2. Open the service → **Settings** → set **Root Directory** to `backend`
3. **Variables** → add every variable from the table below (no quotes around values)
4. Deploy and open **Deployments** → **View logs**
5. Copy the public URL (e.g. `https://weroi-api.up.railway.app`)
6. Hit `https://YOUR-URL/api/health` — expect `{"status":"ok","database":"connected",...}`

**Railway variables checklist**

| Variable | Required at startup | Example / notes |
|----------|---------------------|-----------------|
| `MONGO_URL` | Yes (for lead routes) | `mongodb+srv://USER:PASS@cluster.mongodb.net/weroi?retryWrites=true&w=majority` |
| `DB_NAME` | Yes | `weroi` — must match the database name in Atlas |
| `RESEND_API_KEY` | No | `re_xxxx` — emails skip silently if missing |
| `SENDER_EMAIL` | No | `growth@weroi.net` (verified domain in Resend) |
| `ADMIN_EMAIL` | No | `contact.weroi@gmail.com` |
| `ADMIN_PASSWORD` | No | Dashboard login at `/admin`. **Set a strong value in Railway/production** — the repo default (`Zachattack01@`) is a dev fallback only; override via env var. |
| `CORS_ORIGINS` | No | `https://weroi.net,https://www.weroi.net,https://your-app.vercel.app` |
| `GROQ_API_KEY` | No (GrowthIQ) | Groq API key — free tier works for reports |
| `AI_PROVIDER` | No (GrowthIQ) | `groq` (recommended) or `auto` |
| `GROQ_MODEL` | No (GrowthIQ) | `llama-3.3-70b-versatile` |

**Verify GrowthIQ is live after deploy**

1. Open `https://YOUR-RAILWAY-URL/docs`
2. Confirm you see `POST /api/growthiq/assessment` and `POST /api/growthiq/chat`
3. If those routes are missing, the service is still on old code — check **Root Directory** is `backend` and redeploy

**MongoDB Atlas checklist**

1. **Database user** — username + password with read/write on `weroi`
2. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)  
   Railway has no fixed outbound IP; without this, deploy may pass health check timing but lead forms return 503.
3. **Password URL encoding** — special characters in the password must be percent-encoded in `MONGO_URL`:
   - `@` → `%40`
   - `#` → `%23`
   - `/` → `%2F`
   - Example: password `Zachattack01@` → `Zachattack01%40`
4. Put the database name in the URI path *or* set `DB_NAME`; both should be `weroi`.

**If deploy still fails — read the logs**

| Log symptom | Likely cause | Fix |
|-------------|--------------|-----|
| `KeyError: 'MONGO_URL'` (older builds) | Variable not set on Railway | Add `MONGO_URL` + `DB_NAME`, redeploy |
| `MONGO_URL is not set` | Same | Add variables, redeploy |
| Build fails on `jq` / `pandas` | Bloated `requirements.txt` | Use `requirements-prod.txt` (configured in `railway.toml`) |
| `No module named 'server'` | Wrong root directory | Set root directory to `backend` |
| Health check timeout | App never bound to `$PORT` | Check start command uses `$PORT`, not `8000` |
| `MongoDB ping failed` / `ServerSelectionTimeout` | Atlas firewall or bad URI | Allow `0.0.0.0/0`, re-check encoded password |
| Deploy OK but forms 503 | DB unreachable at runtime | Atlas network + correct `MONGO_URL` |

**Test after deploy**

```bash
curl https://YOUR-RAILWAY-URL/api/health
curl https://YOUR-RAILWAY-URL/api/
```

### Render
1. New Web Service → Python
2. Root directory: `backend`
3. Build: `pip install -r requirements-prod.txt`
4. Start: `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Add env vars (same table as Railway)
6. Health check path: `/api/health`

### Hosting alternatives (if Railway keeps failing)

| Option | Effort | Pros | Cons |
|--------|--------|------|------|
| **Render** (free tier) | Low | Same FastAPI + Atlas setup, simpler UI | Cold starts on free tier |
| **Fly.io** | Medium | Global regions, persistent volumes possible | More CLI/Docker setup |
| **Railway + Atlas** (current) | Low | Fast deploys, good DX | Needs Atlas `0.0.0.0/0` + env vars correct |
| **SQLite on Railway volume** | High | No Atlas | Rewrite all Mongo queries; ephemeral disk without volume |
| **Supabase Postgres** | High | Managed SQL, generous free tier | Full data layer rewrite |
| **Vercel serverless** | High | Pairs with frontend host | APScheduler drip emails need separate cron; not a drop-in |

**Recommendation:** Stay on **Railway + MongoDB Atlas** with the variables above. If Railway is the pain point, try **Render** with the same env vars — no code changes needed.

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

**If live site looks stale after a push**

1. Vercel → Project → **Deployments** → confirm latest commit (`main`) shows **Ready**
2. Root directory must be **`frontend`** (not repo root)
3. Git repo must be **`zacharyahutton/weROI`** (not an old fork)
4. Hard refresh: `Ctrl+Shift+R` on `weroi.net/growth-preview`
5. Compare bundle: view page source → `main.*.js` hash should change after each deploy

**Verify frontend is current**

Open `https://weroi.net/` → View Source → search for `What Is GrowthIQ` in the JS bundle (or use DevTools → Network → `main.*.js`).

**Verify backend is current**

```bash
curl https://weroi-production.up.railway.app/api/health
```

Expect `"growthiq": true` and a recent `"commit"` SHA. Then open `/docs` and confirm `POST /api/growthiq/assessment` exists.

If `growthiq` is missing or `/docs` has no GrowthIQ routes, Railway is still on old code — set **Root Directory** to `backend` and redeploy.

---

## 4. Connect weroi.net Domain (Vercel)

### Add domain in Vercel
1. Project → **Settings** → **Domains**
2. Add `weroi.net` (apex; primary SEO canonical)

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
