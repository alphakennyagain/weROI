from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Query, Response, Request
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
import urllib.parse
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'growth@weroi.net')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'TylerandZach2025!')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Initialize scheduler
scheduler = AsyncIOScheduler()

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
    website: Optional[str] = None
    how_found_us: str
    referrer: Optional[str] = None

class AuditLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: EmailStr
    company_name: str
    website: Optional[str] = None
    how_found_us: str
    referrer: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "new"

# Guide Lead Model
class GuideLeadCreate(BaseModel):
    name: str
    email: EmailStr
    referrer: Optional[str] = None

class GuideLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    referrer: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email_1_sent: bool = False
    email_2_sent: bool = False
    email_3_sent: bool = False
    email_2_scheduled_for: Optional[str] = None
    email_3_scheduled_for: Optional[str] = None

# Enhanced Analytics Models
class AnalyticsEventCreate(BaseModel):
    event_type: str  # page_view, audit_form_start, audit_form_submit, popup_shown, popup_submit, unique_visit
    page: str
    referrer: Optional[str] = None
    session_id: Optional[str] = None

class AnalyticsEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: str
    page: str
    referrer: Optional[str] = None
    session_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Admin Auth
class AdminAuth(BaseModel):
    password: str

# ========================================
# PREMIUM LUXURY EMAIL TEMPLATES
# ========================================

def get_premium_email_template(content: str, headline: str = "", cta_text: str = "", cta_link: str = "") -> str:
    """Generate a premium luxury email template"""
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
                        <tr>
                            <td style="padding: 48px;">
                                {f'<h1 style="color: #111113; font-size: 28px; margin: 0 0 24px 0; font-weight: 600; line-height: 1.3; letter-spacing: -0.5px;">{headline}</h1>' if headline else ''}
                                <div style="color: #444444; font-size: 16px; line-height: 1.8; font-weight: 300;">
                                    {content}
                                </div>
                                {cta_button}
                            </td>
                        </tr>
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

def get_personalized_pdf_url(name: str) -> str:
    """Generate personalized PDF download URL with person's name"""
    # Clean name for filename
    clean_name = name.lower().replace(' ', '_').replace("'", "")
    # The actual PDF URL with download parameter
    base_pdf = "https://customer-assets.emergentagent.com/job_premium-scale-3/artifacts/5x7g95py_xl4qmsi8_weroi_growth_guide%20%281%29.pdf"
    return base_pdf

def get_email_1_content(name: str) -> dict:
    """Email 1: The Delivery (Immediate) - Premium Luxury Style"""
    pdf_url = get_personalized_pdf_url(name)
    clean_name = name.lower().replace(' ', '_').replace("'", "")
    
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
            cta_text=f"Download {name}'s Growth Guide",
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

def get_audit_confirmation_email(name: str, company_name: str, calendly_url: str) -> dict:
    """Audit Form Confirmation Email with Calendly Booking"""
    content = f'''
    <p style="margin: 0 0 20px 0;">{name},</p>
    <p style="margin: 0 0 20px 0;">Your AI Growth Audit request has been received.</p>
    <p style="margin: 24px 0; padding: 24px; background-color: #fafafa; border: 1px solid #e5e5e5;">
        <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999999; margin-bottom: 8px;">Company</span>
        <span style="display: block; font-size: 18px; font-weight: 600; color: #111113;">{company_name}</span>
    </p>
    <p style="margin: 0 0 20px 0; font-weight: 500; color: #111113;">Skip the wait. Book your call now.</p>
    <p style="margin: 0 0 20px 0;">We've reserved priority slots for new audit applicants. Secure your 30-minute discovery call and let's map out your growth opportunities together.</p>
    <p style="margin: 24px 0; padding: 24px; background-color: #111113; color: #ffffff;">
        <span style="display: block; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; color: #DAFF01;">What We'll Cover</span>
        <span style="display: block; font-size: 16px; font-weight: 300; line-height: 1.6;">
            ✓ Your current growth bottlenecks<br>
            ✓ Quick wins you can implement immediately<br>
            ✓ Custom roadmap tailored to {company_name}
        </span>
    </p>
    <p style="margin: 0;">To your growth,<br><strong style="color: #111113;">The weROI Team</strong></p>
    '''
    return {
        "subject": f"Your AI Growth Audit — Book Your Call, {name}",
        "html": get_premium_email_template(
            content,
            headline="You're In. Let's Talk Growth.",
            cta_text="Book Your Discovery Call",
            cta_link=calendly_url
        )
    }

# ========================================
# EMAIL SENDING FUNCTIONS
# ========================================

async def send_email_async(to_email: str, subject: str, html_content: str) -> bool:
    """Send email using Resend"""
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
    """Send audit form confirmation email with Calendly booking"""
    calendly_url = "https://calendly.com/contact-weroi/30min"
    email_data = get_audit_confirmation_email(lead.name, lead.company_name, calendly_url)
    await send_email_async(lead.email, email_data["subject"], email_data["html"])

async def send_email_sequence(lead_id: str, name: str, email: str, company_name: str = ""):
    """Send the 3-email sequence"""
    anti_diy_framework_pdf = "https://customer-assets.emergentagent.com/job_premium-scale-3/artifacts/g2op5jfz_WEROI%20ANTI%20DIY%20FRAMEWORK.pdf"
    audit_url = "https://weroi.net/audit"
    
    # Email 1: Immediate - Growth Guide (personalized)
    email_1 = get_email_1_content(name)
    success = await send_email_async(email, email_1["subject"], email_1["html"])
    
    if success:
        await db.guide_leads.update_one(
            {"id": lead_id},
            {"$set": {"email_1_sent": True}}
        )
        logger.info(f"Email 1 sent to {email}")
    
    # Schedule Email 2 & 3
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
# ENHANCED ANALYTICS ROUTES
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
    """Get comprehensive website analytics"""
    # Unique visitors (by session_id)
    unique_sessions = await db.analytics_events.distinct("session_id", {"session_id": {"$ne": None}})
    total_unique_visitors = len(unique_sessions)
    
    # Page views
    total_page_views = await db.analytics_events.count_documents({"event_type": "page_view"})
    
    # Audit funnel
    audit_form_starts = await db.analytics_events.count_documents({"event_type": "audit_form_start"})
    audit_form_submits = await db.audit_leads.count_documents({})
    audit_conversion_rate = round((audit_form_submits / max(audit_form_starts, 1)) * 100, 1)
    
    # Popup funnel
    popup_shown = await db.analytics_events.count_documents({"event_type": "popup_shown"})
    popup_submits = await db.guide_leads.count_documents({})
    popup_capture_rate = round((popup_submits / max(popup_shown, 1)) * 100, 1)
    
    # Source tracking
    referrer_pipeline = [
        {"$match": {"referrer": {"$ne": None, "$ne": ""}}},
        {"$group": {"_id": "$referrer", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    top_sources = await db.analytics_events.aggregate(referrer_pipeline).to_list(10)
    
    # Also get referrers from leads
    audit_referrers = await db.audit_leads.aggregate([
        {"$match": {"referrer": {"$ne": None, "$ne": ""}}},
        {"$group": {"_id": "$referrer", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]).to_list(5)
    
    guide_referrers = await db.guide_leads.aggregate([
        {"$match": {"referrer": {"$ne": None, "$ne": ""}}},
        {"$group": {"_id": "$referrer", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]).to_list(5)
    
    return {
        "total_unique_visitors": total_unique_visitors,
        "total_page_views": total_page_views,
        "audit_funnel": {
            "started": audit_form_starts,
            "submitted": audit_form_submits,
            "conversion_rate": audit_conversion_rate
        },
        "popup_funnel": {
            "shown": popup_shown,
            "submitted": popup_submits,
            "capture_rate": popup_capture_rate
        },
        "top_sources": top_sources,
        "lead_sources": {
            "audit": audit_referrers,
            "guide": guide_referrers
        }
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

@api_router.get("/leads/audit")
async def get_audit_leads():
    """Get all audit leads"""
    leads = await db.audit_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return leads

@api_router.get("/leads/guide")
async def get_guide_leads():
    """Get all guide leads"""
    leads = await db.guide_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
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

# DELETE ROUTES
# EDIT/UPDATE ROUTES
class AuditLeadUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    website: Optional[str] = None
    how_found_us: Optional[str] = None
    status: Optional[str] = None
    referrer: Optional[str] = None

class GuideLeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    referrer: Optional[str] = None

@api_router.put("/leads/audit/{lead_id}")
async def update_audit_lead(lead_id: str, update: AuditLeadUpdate, password: str = Query(...)):
    """Update a specific audit lead"""
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.audit_leads.update_one({"id": lead_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    updated_lead = await db.audit_leads.find_one({"id": lead_id}, {"_id": 0})
    return updated_lead

@api_router.put("/leads/guide/{lead_id}")
async def update_guide_lead(lead_id: str, update: GuideLeadUpdate, password: str = Query(...)):
    """Update a specific guide lead"""
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.guide_leads.update_one({"id": lead_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    updated_lead = await db.guide_leads.find_one({"id": lead_id}, {"_id": 0})
    return updated_lead

@api_router.delete("/leads/audit/{lead_id}")
async def delete_audit_lead(lead_id: str, password: str = Query(...)):
    """Delete a specific audit lead"""
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    result = await db.audit_leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"deleted": True, "id": lead_id}

@api_router.delete("/leads/guide/{lead_id}")
async def delete_guide_lead(lead_id: str, password: str = Query(...)):
    """Delete a specific guide lead"""
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    result = await db.guide_leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"deleted": True, "id": lead_id}

@api_router.delete("/leads/clear-all")
async def clear_all_leads(password: str = Query(...), lead_type: str = Query(...)):
    """Clear all leads of a specific type"""
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    if lead_type == "audit":
        result = await db.audit_leads.delete_many({})
        return {"deleted": True, "count": result.deleted_count, "type": "audit"}
    elif lead_type == "guide":
        result = await db.guide_leads.delete_many({})
        return {"deleted": True, "count": result.deleted_count, "type": "guide"}
    elif lead_type == "all":
        audit_result = await db.audit_leads.delete_many({})
        guide_result = await db.guide_leads.delete_many({})
        analytics_result = await db.analytics_events.delete_many({})
        return {
            "deleted": True, 
            "audit_count": audit_result.deleted_count,
            "guide_count": guide_result.deleted_count,
            "analytics_count": analytics_result.deleted_count
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid lead_type. Use 'audit', 'guide', or 'all'")

@api_router.get("/leads/export/csv")
async def export_leads_csv():
    """Export all leads to CSV"""
    audit_leads = await db.audit_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    guide_leads = await db.guide_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(['Type', 'Date', 'Name', 'Email', 'Phone', 'Company', 'Source', 'Referrer', 'Status'])
    
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
            lead.get('referrer', ''),
            lead.get('status', 'new')
        ])
    
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
            lead.get('referrer', ''),
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
    
    # Get enhanced analytics
    unique_sessions = await db.analytics_events.distinct("session_id", {"session_id": {"$ne": None}})
    total_unique_visitors = len(unique_sessions)
    total_page_views = await db.analytics_events.count_documents({"event_type": "page_view"})
    audit_form_starts = await db.analytics_events.count_documents({"event_type": "audit_form_start"})
    popup_shown = await db.analytics_events.count_documents({"event_type": "popup_shown"})
    
    # Source tracking
    referrer_pipeline = [
        {"$match": {"referrer": {"$ne": None, "$ne": ""}}},
        {"$group": {"_id": "$referrer", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    top_sources = await db.analytics_events.aggregate(referrer_pipeline).to_list(10)
    
    return {
        "audit_leads": audit_leads,
        "guide_leads": guide_leads,
        "stats": {
            "total_unique_visitors": total_unique_visitors,
            "total_page_views": total_page_views,
            "total_audit_leads": len(audit_leads),
            "total_guide_leads": len(guide_leads),
            "audit_form_starts": audit_form_starts,
            "audit_conversion_rate": round((len(audit_leads) / max(audit_form_starts, 1)) * 100, 1),
            "popup_shown": popup_shown,
            "popup_capture_rate": round((len(guide_leads) / max(popup_shown, 1)) * 100, 1),
            "top_sources": top_sources
        }
    }

# Background task to process scheduled emails
@api_router.post("/emails/process-scheduled")
async def process_scheduled_emails():
    """Process scheduled emails"""
    now = datetime.now(timezone.utc)
    anti_diy_framework_pdf = "https://customer-assets.emergentagent.com/job_premium-scale-3/artifacts/g2op5jfz_WEROI%20ANTI%20DIY%20FRAMEWORK.pdf"
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
        email_2 = get_email_2_content(lead['name'], anti_diy_framework_pdf)
        success = await send_email_async(lead['email'], email_2["subject"], email_2["html"])
        if success:
            await db.guide_leads.update_one(
                {"id": lead['id']},
                {"$set": {"email_2_sent": True}}
            )
            processed_2 += 1
    
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
    
    return {
        "processed_email_2": processed_2,
        "processed_email_3": processed_3
    }

# Include the router
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
    scheduler.shutdown()
    client.close()

# ========================================
# BACKGROUND EMAIL SCHEDULER
# ========================================

async def process_scheduled_emails_job():
    """Background job to process scheduled emails (runs every 15 minutes)"""
    now = datetime.now(timezone.utc)
    anti_diy_framework_pdf = "https://customer-assets.emergentagent.com/job_premium-scale-3/artifacts/g2op5jfz_WEROI%20ANTI%20DIY%20FRAMEWORK.pdf"
    audit_url = "https://weroi.net/audit"
    
    processed_2 = 0
    processed_3 = 0
    
    try:
        # Find leads needing Email 2 (24 hours after Email 1)
        leads_for_email_2 = await db.guide_leads.find({
            "email_1_sent": True,
            "email_2_sent": False,
            "email_2_scheduled_for": {"$lte": now.isoformat()}
        }, {"_id": 0}).to_list(100)
        
        for lead in leads_for_email_2:
            email_2 = get_email_2_content(lead['name'], anti_diy_framework_pdf)
            success = await send_email_async(lead['email'], email_2["subject"], email_2["html"])
            if success:
                await db.guide_leads.update_one(
                    {"id": lead['id']},
                    {"$set": {"email_2_sent": True, "email_2_sent_at": now.isoformat()}}
                )
                processed_2 += 1
                logger.info(f"Email 2 sent to {lead['email']}")
        
        # Find leads needing Email 3 (48 hours after Email 1)
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
                    {"$set": {"email_3_sent": True, "email_3_sent_at": now.isoformat()}}
                )
                processed_3 += 1
                logger.info(f"Email 3 sent to {lead['email']}")
        
        if processed_2 > 0 or processed_3 > 0:
            logger.info(f"Scheduled email job completed: {processed_2} Email 2s, {processed_3} Email 3s sent")
    
    except Exception as e:
        logger.error(f"Error in scheduled email job: {str(e)}")

@app.on_event("startup")
async def startup_event():
    """Start the background scheduler on app startup"""
    # Schedule email processing every 15 minutes
    scheduler.add_job(
        process_scheduled_emails_job,
        IntervalTrigger(minutes=15),
        id="email_scheduler",
        name="Process scheduled follow-up emails",
        replace_existing=True
    )
    scheduler.start()
    logger.info("Background email scheduler started - checking every 15 minutes")
