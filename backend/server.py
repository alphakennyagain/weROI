from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
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

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

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

# ========================================
# EMAIL TEMPLATES
# ========================================

def get_email_template(content: str, headline: str = "") -> str:
    """Generate a premium branded email template"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #111113; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111113; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1c1e; border-radius: 16px; border: 1px solid rgba(218, 255, 1, 0.2);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 32px 40px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td>
                                            <span style="font-size: 24px; font-weight: 700;">
                                                <span style="color: rgba(218, 255, 1, 0.8);">we</span><span style="color: #DAFF01; font-weight: 900;">ROI</span>
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                {f'<h1 style="color: #DAFF01; font-size: 28px; margin: 0 0 24px 0; font-weight: 700;">{headline}</h1>' if headline else ''}
                                <div style="color: #e0e0e0; font-size: 16px; line-height: 1.7;">
                                    {content}
                                </div>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 24px 40px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
                                <p style="color: #666; font-size: 12px; margin: 0;">
                                    © 2025 weROI. Engineered for Growth.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

def get_email_1_content(name: str, pdf_url: str) -> dict:
    """Email 1: The Delivery (Immediate)"""
    content = f"""
    <p>Hi {name},</p>
    <p>You made a smart move.</p>
    <p>Most businesses stay small because they lack the systems to scale—you just took the first step to changing that.</p>
    <p style="margin: 24px 0;">
        <a href="{pdf_url}" style="display: inline-block; background-color: #DAFF01; color: #111113; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Download Your Scaling Blueprint →
        </a>
    </p>
    <p>Inside, look specifically at <strong style="color: #DAFF01;">Step 3</strong>; it's the "missing link" for most weROI clients.</p>
    <p style="margin-top: 32px;">Talk soon,<br><strong style="color: #DAFF01;">The weROI Team</strong></p>
    """
    return {
        "subject": "Your Scaling Blueprint has arrived 🚀",
        "html": get_email_template(content)
    }

def get_email_2_content(name: str, audit_url: str) -> dict:
    """Email 2: The Value Add (24 Hours Later)"""
    content = f"""
    <p>{name}, quick question:</p>
    <p>Did you look at the <strong style="color: #DAFF01;">'Online Trust'</strong> section in the guide?</p>
    <p>Most founders try to automate growth before they've fixed their credibility.</p>
    <p>We've found that even a <strong>10% increase in trust metrics</strong> can double your ROI.</p>
    <p>This is exactly what we analyze during our AI Growth Audits.</p>
    <p style="margin: 32px 0;">
        <strong>Want to see where your trust leaks are?</strong>
    </p>
    <p>
        <a href="{audit_url}" style="display: inline-block; background-color: #DAFF01; color: #111113; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Claim Your Free AI Growth Audit →
        </a>
    </p>
    """
    return {
        "subject": "Why DIY scaling usually fails...",
        "html": get_email_template(content)
    }

def get_email_3_content(name: str, company_name: str, audit_url: str) -> dict:
    """Email 3: The Hard Pivot (48 Hours Later)"""
    content = f"""
    <p>By now, you've seen the blueprint.</p>
    <p>But a map is useless if you don't have the engine to drive the car.</p>
    <p style="background: rgba(218, 255, 1, 0.1); border-left: 3px solid #DAFF01; padding: 16px 20px; margin: 24px 0;">
        We have <strong style="color: #DAFF01;">2 spots open this month</strong> for a Free AI Growth Audit.
    </p>
    <p>We'll dive into <strong>{company_name if company_name else 'your'}</strong>'s specific bottlenecks and hand you a ready-to-sign roadmap.</p>
    <p><strong>No fluff. Just ROI.</strong></p>
    <p style="margin: 32px 0;">
        <a href="{audit_url}" style="display: inline-block; background-color: #DAFF01; color: #111113; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Claim Your Spot →
        </a>
    </p>
    """
    return {
        "subject": f"A custom roadmap for {company_name}?" if company_name else "A custom roadmap for your business?",
        "html": get_email_template(content)
    }

# ========================================
# EMAIL SENDING FUNCTIONS
# ========================================

async def send_email_async(to_email: str, subject: str, html_content: str) -> bool:
    """Send email using Resend (async wrapper)"""
    try:
        params = {
            "from": SENDER_EMAIL,
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

async def send_email_sequence(lead_id: str, name: str, email: str, company_name: str = ""):
    """Send the 3-email sequence with delays"""
    pdf_url = "https://customer-assets.emergentagent.com/job_premium-scale-3/artifacts/xl4qmsi8_WEROI%20GROWTH%20GUIDE.pdf"
    audit_url = "https://weroi.net/audit"  # Will be replaced with actual URL
    
    # Email 1: Immediate
    email_1 = get_email_1_content(name, pdf_url)
    success = await send_email_async(email, email_1["subject"], email_1["html"])
    
    if success:
        await db.guide_leads.update_one(
            {"id": lead_id},
            {"$set": {"email_1_sent": True}}
        )
        logger.info(f"Email 1 sent to {email}")
    
    # Schedule Email 2 for 24 hours later (in production, use a proper job scheduler)
    # For now, we'll store the scheduled time and use a background task
    email_2_time = datetime.now(timezone.utc) + timedelta(hours=24)
    email_3_time = datetime.now(timezone.utc) + timedelta(hours=48)
    
    await db.guide_leads.update_one(
        {"id": lead_id},
        {"$set": {
            "email_2_scheduled_for": email_2_time.isoformat(),
            "email_3_scheduled_for": email_3_time.isoformat()
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
# LEAD MANAGEMENT ROUTES
# ========================================

@api_router.post("/leads/audit", response_model=AuditLead)
async def create_audit_lead(input: AuditLeadCreate):
    """Submit an audit form lead"""
    lead_obj = AuditLead(**input.model_dump())
    doc = lead_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.audit_leads.insert_one(doc)
    logger.info(f"New audit lead created: {lead_obj.email}")
    
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
        ""  # No company name for guide leads
    )
    
    return lead_obj

@api_router.get("/leads/audit", response_model=List[AuditLead])
async def get_audit_leads():
    """Get all audit leads (admin endpoint)"""
    leads = await db.audit_leads.find({}, {"_id": 0}).to_list(1000)
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return leads

@api_router.get("/leads/guide", response_model=List[GuideLead])
async def get_guide_leads():
    """Get all guide leads (admin endpoint)"""
    leads = await db.guide_leads.find({}, {"_id": 0}).to_list(1000)
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return leads

@api_router.get("/leads/stats")
async def get_lead_stats():
    """Get lead statistics"""
    audit_count = await db.audit_leads.count_documents({})
    guide_count = await db.guide_leads.count_documents({})
    
    # Get recent leads
    recent_audit = await db.audit_leads.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    recent_guide = await db.guide_leads.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    
    return {
        "total_audit_leads": audit_count,
        "total_guide_leads": guide_count,
        "recent_audit_leads": recent_audit,
        "recent_guide_leads": recent_guide
    }

# Background task to process scheduled emails
@api_router.post("/emails/process-scheduled")
async def process_scheduled_emails():
    """Process scheduled emails (call this via cron or manually)"""
    now = datetime.now(timezone.utc)
    pdf_url = "https://customer-assets.emergentagent.com/job_premium-scale-3/artifacts/xl4qmsi8_WEROI%20GROWTH%20GUIDE.pdf"
    audit_url = "https://weroi.net/audit"
    
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
            logger.info(f"Email 2 sent to {lead['email']}")
    
    # Find leads needing Email 3
    leads_for_email_3 = await db.guide_leads.find({
        "email_2_sent": True,
        "email_3_sent": False,
        "email_3_scheduled_for": {"$lte": now.isoformat()}
    }, {"_id": 0}).to_list(100)
    
    for lead in leads_for_email_3:
        email_3 = get_email_3_content(lead['name'], "", audit_url)
        success = await send_email_async(lead['email'], email_3["subject"], email_3["html"])
        if success:
            await db.guide_leads.update_one(
                {"id": lead['id']},
                {"$set": {"email_3_sent": True}}
            )
            logger.info(f"Email 3 sent to {lead['email']}")
    
    return {
        "processed_email_2": len(leads_for_email_2),
        "processed_email_3": len(leads_for_email_3)
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
