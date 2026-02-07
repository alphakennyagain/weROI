from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Query, Response
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import resend
import csv
import io

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'contact.weroi@gmail.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'weROI2025Admin!')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ========================================
# MODELS
# ========================================

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Audit Lead Model
class AuditLeadCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    company_name: str
    how_found_us: str

class AuditLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: EmailStr
    company_name: str
    how_found_us: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "new"

# Guide Lead Model (for exit-intent popup)
class GuideLeadCreate(BaseModel):
    name: str
    email: EmailStr

class GuideLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email_1_sent: bool = False
    email_2_sent: bool = False
    email_3_sent: bool = False
    email_2_scheduled_for: Optional[str] = None
    email_3_scheduled_for: Optional[str] = None

# Analytics Model
class AnalyticsEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: str  # page_view, form_submission, popup_download
    page: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_agent: Optional[str] = None

class AnalyticsEventCreate(BaseModel):
    event_type: str
    page: str
    user_agent: Optional[str] = None

# Admin Auth
class AdminAuth(BaseModel):
    password: str

# ========================================
# PREMIUM LUXURY EMAIL TEMPLATES
# ========================================

def get_premium_email_template(content: str, headline: str = "", cta_text: str = "", cta_link: str = "") -> str:
    """Generate a premium luxury email template - Dark grey text on white, minimalist design"""
    cta_button = ""
    if cta_text and cta_link:
        cta_button = f'''
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
            <tr>
                <td align="center">
                    <a href="{cta_link}" style="display: inline-block; background-color: #111113; color: #DAFF01; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; border: 1px solid #111113;">
                        {cta_text}
                    </a>
                </td>
            </tr>
        </table>
        '''
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>weROI</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f8f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; padding: 48px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e5e5e5;">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 48px 32px; border-bottom: 1px solid #f0f0f0;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td>
                                            <span style="font-size: 24px; font-weight: 300; letter-spacing: 2px;">
                                                <span style="color: #888888;">we</span><span style="color: #111113; font-weight: 700;">ROI</span>
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td style="padding: 48px;">
                                {f'<h1 style="color: #111113; font-size: 28px; margin: 0 0 24px 0; font-weight: 600; line-height: 1.3; letter-spacing: -0.5px;">{headline}</h1>' if headline else ''}
                                <div style="color: #444444; font-size: 16px; line-height: 1.8; font-weight: 300;">
                                    {content}
                                </div>
                                {cta_button}
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 32px 48px; border-top: 1px solid #f0f0f0; text-align: center;">
                                <p style="color: #999999; font-size: 12px; margin: 0; letter-spacing: 1px; text-transform: uppercase;">
                                    Engineered for Growth
                                </p>
                                <p style="color: #cccccc; font-size: 11px; margin: 12px 0 0 0;">
                                    © 2025 weROI. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    '''

def get_email_1_content(name: str, pdf_url: str) -> dict:
    """Email 1: The Delivery (Immediate) - Premium Luxury Style"""
    content = f'''
    <p style="margin: 0 0 20px 0;">{name},</p>
    <p style="margin: 0 0 20px 0;">You made a smart move.</p>
    <p style="margin: 0 0 20px 0;">Most businesses stay small because they lack the systems to scale—you just took the first step to changing that.</p>
    <p style="margin: 0 0 8px 0; color: #111113; font-weight: 500;">Your blueprint is ready.</p>
    <p style="margin: 0 0 20px 0;">Inside, pay close attention to <strong style="color: #111113;">Step 3: The Trust Architecture</strong>—it's the missing link for most of our clients.</p>
    <p style="margin: 24px 0; padding: 20px; background-color: #fafafa; border-left: 3px solid #111113;">
        <em style="color: #666666;">"Structure beats strategy. Systems beat talent."</em>
    </p>
    <p style="margin: 0;">Talk soon,<br><strong style="color: #111113;">The weROI Team</strong></p>
    '''
    return {
        "subject": "Your Scaling Blueprint Has Arrived",
        "html": get_premium_email_template(
            content, 
            headline="Your $0 to $1M Blueprint",
            cta_text="Download Your Blueprint",
            cta_link=pdf_url
        )
    }

def get_email_2_content(name: str, framework_pdf_url: str) -> dict:
    """Email 2: The Value Add (24 Hours Later) - Premium Luxury Style with Anti-DIY Framework"""
    content = f'''
    <p style="margin: 0 0 20px 0;">{name},</p>
    <p style="margin: 0 0 20px 0;">Quick question:</p>
    <p style="margin: 0 0 20px 0;">Did you get to the <strong style="color: #111113;">'Online Trust'</strong> section in the guide?</p>
    <p style="margin: 0 0 20px 0;">Most founders try to automate growth before they've fixed their credibility. It's like pouring water into a bucket with holes.</p>
    <p style="margin: 0 0 20px 0;">We've found that even a <strong style="color: #111113;">10% increase in trust metrics</strong> can double your conversion rate.</p>
    <p style="margin: 24px 0; padding: 24px; background-color: #111113; color: #ffffff;">
        <span style="display: block; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; color: #DAFF01;">The weROI Insight</span>
        <span style="font-size: 18px; font-weight: 300;">Trust leaks cost businesses 40-60% of potential revenue. Most don't even know where to look.</span>
    </p>
    <p style="margin: 0 0 20px 0;">That's why we created the <strong style="color: #111113;">Anti-DIY Framework</strong> — a blueprint for founders who are done guessing and ready to build systems that actually scale.</p>
    <p style="margin: 0;">Download it below. It's the exact framework we use with our clients.</p>
    '''
    return {
        "subject": "Why DIY Scaling Usually Fails",
        "html": get_premium_email_template(
            content,
            headline="The Hidden Cost of Trust Leaks",
            cta_text="Download The Anti-DIY Framework",
            cta_link=framework_pdf_url
        )
    }

def get_email_3_content(name: str, company_name: str, audit_url: str) -> dict:
    """Email 3: The Hard Pivot (48 Hours Later) - Premium Luxury Style"""
    company_display = company_name if company_name else "your business"
    content = f'''
    <p style="margin: 0 0 20px 0;">By now, you've seen the blueprint.</p>
    <p style="margin: 0 0 20px 0;">But here's the truth: <strong style="color: #111113;">a map is useless without an engine.</strong></p>
    <p style="margin: 24px 0; padding: 24px; border: 1px solid #e5e5e5;">
        <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999999; margin-bottom: 8px;">Limited Availability</span>
        <span style="display: block; font-size: 24px; font-weight: 600; color: #111113;">2 Spots Open</span>
        <span style="display: block; font-size: 14px; color: #666666; margin-top: 4px;">This month's Free AI Growth Audits</span>
    </p>
    <p style="margin: 0 0 20px 0;">We'll dive into <strong style="color: #111113;">{company_display}</strong>'s specific bottlenecks and hand you a ready-to-implement roadmap.</p>
    <p style="margin: 0 0 8px 0; font-weight: 500; color: #111113;">What you'll receive:</p>
    <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #444444;">
        <li style="margin-bottom: 8px;">Complete trust & conversion audit</li>
        <li style="margin-bottom: 8px;">Top 5 revenue leaks identified</li>
        <li style="margin-bottom: 8px;">Custom implementation roadmap</li>
        <li style="margin-bottom: 8px;">ROI projection model</li>
    </ul>
    <p style="margin: 0; font-weight: 500; color: #111113;">No fluff. Just ROI.</p>
    '''
    return {
        "subject": f"A Custom Roadmap for {company_display}?",
        "html": get_premium_email_template(
            content,
            headline="Your Engine Awaits",
            cta_text="Claim Your Free Audit",
            cta_link=audit_url
        )
    }

def get_audit_confirmation_email(name: str, company_name: str) -> dict:
    """Audit Form Confirmation Email - Premium Luxury Style"""
    content = f'''
    <p style="margin: 0 0 20px 0;">{name},</p>
    <p style="margin: 0 0 20px 0;">Your AI Growth Audit request has been received.</p>
    <p style="margin: 24px 0; padding: 24px; background-color: #fafafa; border: 1px solid #e5e5e5;">
        <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999999; margin-bottom: 8px;">Company</span>
        <span style="display: block; font-size: 18px; font-weight: 600; color: #111113;">{company_name}</span>
    </p>
    <p style="margin: 0 0 8px 0; font-weight: 500; color: #111113;">What happens next:</p>
    <ol style="margin: 0 0 20px 0; padding-left: 20px; color: #444444;">
        <li style="margin-bottom: 12px;"><strong style="color: #111113;">Within 24 hours</strong> — Our team reviews your submission</li>
        <li style="margin-bottom: 12px;"><strong style="color: #111113;">Within 48 hours</strong> — You'll receive a personalized response with next steps</li>
        <li style="margin-bottom: 12px;"><strong style="color: #111113;">Discovery Call</strong> — A 30-minute deep dive into your growth opportunities</li>
    </ol>
    <p style="margin: 0 0 20px 0;">In the meantime, keep an eye on your inbox. We move fast.</p>
    <p style="margin: 0;">To your growth,<br><strong style="color: #111113;">The weROI Team</strong></p>
    '''
    return {
        "subject": "Your AI Growth Audit Request — Received",
        "html": get_premium_email_template(
            content,
            headline="We've Got Your Request"
        )
    }

# ========================================
# EMAIL SENDING FUNCTIONS
# ========================================

async def send_email_async(to_email: str, subject: str, html_content: str) -> bool:
    """Send email using Resend (async wrapper)"""
    try:
        params = {
            "from": f"weROI <{SENDER_EMAIL}>",
            "to": [to_email],
            "subject": subject,
            "html": html_content
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent successfully to {to_email}: {result}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False

async def send_audit_confirmation(lead: AuditLead):
    """Send audit form confirmation email"""
    email_data = get_audit_confirmation_email(lead.name, lead.company_name)
    await send_email_async(lead.email, email_data["subject"], email_data["html"])

async def send_email_sequence(lead_id: str, name: str, email: str, company_name: str = ""):
    """Send the 3-email sequence with delays"""
    pdf_url = "https://customer-assets.emergentagent.com/job_premium-scale-3/artifacts/xl4qmsi8_WEROI%20GROWTH%20GUIDE.pdf"
    audit_url = "https://weroi.net/audit"
    
    # Email 1: Immediate
    email_1 = get_email_1_content(name, pdf_url)
    success = await send_email_async(email, email_1["subject"], email_1["html"])
    
    if success:
        await db.guide_leads.update_one(
            {"id": lead_id},
            {"$set": {"email_1_sent": True}}
        )
        logger.info(f"Email 1 sent to {email}")
    
    # Schedule Email 2 for 24 hours later
    email_2_time = datetime.now(timezone.utc) + timedelta(hours=24)
    email_3_time = datetime.now(timezone.utc) + timedelta(hours=48)
    
    await db.guide_leads.update_one(
        {"id": lead_id},
        {"$set": {
            "email_2_scheduled_for": email_2_time.isoformat(),
            "email_3_scheduled_for": email_3_time.isoformat(),
            "company_name": company_name
        }}
    )
    
    logger.info(f"Email sequence initiated for {email}. Email 2 scheduled for {email_2_time}, Email 3 for {email_3_time}")

# ========================================
# ROUTES
# ========================================

@api_router.get("/")
async def root():
    return {"message": "weROI API - Lead Generation System"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# ========================================
# ANALYTICS ROUTES
# ========================================

@api_router.post("/analytics/event")
async def track_event(input: AnalyticsEventCreate):
    """Track analytics event"""
    event = AnalyticsEvent(**input.model_dump())
    doc = event.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.analytics_events.insert_one(doc)
    return {"status": "tracked", "id": event.id}

@api_router.get("/analytics/stats")
async def get_analytics_stats():
    """Get website analytics statistics"""
    # Total page views
    total_views = await db.analytics_events.count_documents({"event_type": "page_view"})
    
    # Form submissions
    form_submissions = await db.audit_leads.count_documents({})
    
    # Popup downloads
    popup_downloads = await db.guide_leads.count_documents({})
    
    # Daily stats for last 7 days
    seven_days_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    
    pipeline = [
        {"$match": {"timestamp": {"$gte": seven_days_ago}}},
        {"$group": {
            "_id": {"$substr": ["$timestamp", 0, 10]},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    
    daily_views = await db.analytics_events.aggregate(pipeline).to_list(100)
    
    return {
        "total_page_views": total_views,
        "total_form_submissions": form_submissions,
        "total_popup_downloads": popup_downloads,
        "conversion_rate": round((form_submissions + popup_downloads) / max(total_views, 1) * 100, 2),
        "daily_views": daily_views
    }

# ========================================
# LEAD MANAGEMENT ROUTES
# ========================================

@api_router.post("/leads/audit", response_model=AuditLead)
async def create_audit_lead(input: AuditLeadCreate, background_tasks: BackgroundTasks):
    """Submit an audit form lead"""
    lead_obj = AuditLead(**input.model_dump())
    doc = lead_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.audit_leads.insert_one(doc)
    logger.info(f"New audit lead created: {lead_obj.email}")
    
    # Send confirmation email in background
    background_tasks.add_task(send_audit_confirmation, lead_obj)
    
    return lead_obj

@api_router.post("/leads/guide", response_model=GuideLead)
async def create_guide_lead(input: GuideLeadCreate, background_tasks: BackgroundTasks):
    """Submit a guide download lead and trigger email sequence"""
    lead_obj = GuideLead(**input.model_dump())
    doc = lead_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.guide_leads.insert_one(doc)
    logger.info(f"New guide lead created: {lead_obj.email}")
    
    # Trigger email sequence in background
    background_tasks.add_task(
        send_email_sequence,
        lead_obj.id,
        input.name,
        input.email,
        ""
    )
    
    return lead_obj

@api_router.get("/leads/audit", response_model=List[AuditLead])
async def get_audit_leads():
    """Get all audit leads (admin endpoint)"""
    leads = await db.audit_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return leads

@api_router.get("/leads/guide", response_model=List[GuideLead])
async def get_guide_leads():
    """Get all guide leads (admin endpoint)"""
    leads = await db.guide_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return leads

@api_router.get("/leads/stats")
async def get_lead_stats():
    """Get lead statistics"""
    audit_count = await db.audit_leads.count_documents({})
    guide_count = await db.guide_leads.count_documents({})
    
    recent_audit = await db.audit_leads.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    recent_guide = await db.guide_leads.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    
    return {
        "total_audit_leads": audit_count,
        "total_guide_leads": guide_count,
        "recent_audit_leads": recent_audit,
        "recent_guide_leads": recent_guide
    }

@api_router.get("/leads/export/csv")
async def export_leads_csv():
    """Export all leads to CSV"""
    audit_leads = await db.audit_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    guide_leads = await db.guide_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow(['Type', 'Date', 'Name', 'Email', 'Phone', 'Company', 'Source', 'Status'])
    
    # Audit leads
    for lead in audit_leads:
        created = lead.get('created_at', '')
        if isinstance(created, datetime):
            created = created.strftime('%Y-%m-%d %H:%M')
        elif isinstance(created, str):
            created = created[:16].replace('T', ' ')
        writer.writerow([
            'Audit',
            created,
            lead.get('name', ''),
            lead.get('email', ''),
            lead.get('phone', ''),
            lead.get('company_name', ''),
            lead.get('how_found_us', ''),
            lead.get('status', 'new')
        ])
    
    # Guide leads
    for lead in guide_leads:
        created = lead.get('created_at', '')
        if isinstance(created, datetime):
            created = created.strftime('%Y-%m-%d %H:%M')
        elif isinstance(created, str):
            created = created[:16].replace('T', ' ')
        writer.writerow([
            'Guide',
            created,
            lead.get('name', ''),
            lead.get('email', ''),
            '',
            '',
            'Popup',
            'downloaded'
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=weroi_leads_{datetime.now().strftime('%Y%m%d')}.csv"}
    )

# ========================================
# ADMIN AUTHENTICATION
# ========================================

@api_router.post("/admin/auth")
async def admin_authenticate(auth: AdminAuth):
    """Authenticate admin access"""
    if auth.password == ADMIN_PASSWORD:
        return {"authenticated": True, "token": "admin_session_valid"}
    raise HTTPException(status_code=401, detail="Invalid password")

@api_router.get("/admin/dashboard-data")
async def get_dashboard_data(password: str = Query(...)):
    """Get all dashboard data (protected)"""
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    # Get all leads
    audit_leads = await db.audit_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    guide_leads = await db.guide_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    # Get analytics
    total_views = await db.analytics_events.count_documents({"event_type": "page_view"})
    
    # Daily stats for chart
    seven_days_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    
    return {
        "audit_leads": audit_leads,
        "guide_leads": guide_leads,
        "stats": {
            "total_page_views": total_views,
            "total_audit_leads": len(audit_leads),
            "total_guide_leads": len(guide_leads),
            "conversion_rate": round((len(audit_leads) + len(guide_leads)) / max(total_views, 1) * 100, 2)
        }
    }

# Background task to process scheduled emails
@api_router.post("/emails/process-scheduled")
async def process_scheduled_emails():
    """Process scheduled emails (call this via cron or manually)"""
    now = datetime.now(timezone.utc)
    pdf_url = "https://customer-assets.emergentagent.com/job_premium-scale-3/artifacts/xl4qmsi8_WEROI%20GROWTH%20GUIDE.pdf"
    audit_url = "https://weroi.net/audit"
    
    processed_2 = 0
    processed_3 = 0
    
    # Find leads needing Email 2
    leads_for_email_2 = await db.guide_leads.find({
        "email_1_sent": True,
        "email_2_sent": False,
        "email_2_scheduled_for": {"$lte": now.isoformat()}
    }, {"_id": 0}).to_list(100)
    
    for lead in leads_for_email_2:
        email_2 = get_email_2_content(lead['name'], audit_url)
        success = await send_email_async(lead['email'], email_2["subject"], email_2["html"])
        if success:
            await db.guide_leads.update_one(
                {"id": lead['id']},
                {"$set": {"email_2_sent": True}}
            )
            processed_2 += 1
            logger.info(f"Email 2 sent to {lead['email']}")
    
    # Find leads needing Email 3
    leads_for_email_3 = await db.guide_leads.find({
        "email_2_sent": True,
        "email_3_sent": False,
        "email_3_scheduled_for": {"$lte": now.isoformat()}
    }, {"_id": 0}).to_list(100)
    
    for lead in leads_for_email_3:
        company_name = lead.get('company_name', '')
        email_3 = get_email_3_content(lead['name'], company_name, audit_url)
        success = await send_email_async(lead['email'], email_3["subject"], email_3["html"])
        if success:
            await db.guide_leads.update_one(
                {"id": lead['id']},
                {"$set": {"email_3_sent": True}}
            )
            processed_3 += 1
            logger.info(f"Email 3 sent to {lead['email']}")
    
    return {
        "processed_email_2": processed_2,
        "processed_email_3": processed_3
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
