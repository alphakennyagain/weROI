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
from email_templates import (
    ANTI_DIY_PDF,
    AUDIT_URL,
    CALENDLY_URL,
    get_audit_confirmation_email,
    get_audit_owner_notification_email,
    get_email_1_content,
    get_email_2_content,
    get_email_3_content,
    get_growth_audit_email,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB — lazy init so uvicorn can start and serve /api/health even if vars are missing.
_mongo_client: AsyncIOMotorClient | None = None
_mongo_db = None


def _db_name() -> str:
    return os.environ.get("DB_NAME", "weroi")


def get_db():
    """Return the Mongo database, initializing the client on first use."""
    global _mongo_client, _mongo_db
    if _mongo_db is None:
        mongo_url = os.environ.get("MONGO_URL")
        if not mongo_url:
            raise HTTPException(
                status_code=503,
                detail="Database not configured: set MONGO_URL and DB_NAME in Railway Variables",
            )
        _mongo_client = AsyncIOMotorClient(mongo_url)
        _mongo_db = _mongo_client[_db_name()]
    return _mongo_db


class _MongoProxy:
    """Transparent proxy so existing `db.collection` call sites stay unchanged."""

    def __getattr__(self, name):
        return getattr(get_db(), name)


db = _MongoProxy()

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'growth@weroi.net')
REPLY_TO_EMAIL = os.environ.get('REPLY_TO_EMAIL', 'contact.weroi@gmail.com')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'contact.weroi@gmail.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'TylerandZach2025!')


def _email_config_status() -> dict:
    """Surface email configuration issues without exposing secrets."""
    warnings: list[str] = []
    if not resend.api_key:
        warnings.append("RESEND_API_KEY not set — transactional emails are skipped")
    if SENDER_EMAIL.endswith("@gmail.com"):
        warnings.append(
            f"SENDER_EMAIL ({SENDER_EMAIL}) uses gmail.com — Resend requires a verified custom domain"
        )
    return {
        "resend_configured": bool(resend.api_key),
        "sender_email": SENDER_EMAIL,
        "admin_email": ADMIN_EMAIL,
        "warnings": warnings,
    }

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
    business_description: Optional[str] = None
    services_interested: List[str] = Field(default_factory=list)
    timeline: Optional[str] = None
    additional_details: Optional[str] = None
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
    business_description: Optional[str] = None
    services_interested: List[str] = Field(default_factory=list)
    timeline: Optional[str] = None
    additional_details: Optional[str] = None
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
# EMAIL SENDING FUNCTIONS
# ========================================

async def send_email_async(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: str = "",
    reply_to: str | None = None,
    include_unsubscribe: bool = False,
) -> bool:
    """Send email using Resend with HTML + plain-text parts."""
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not set — skipping email to %s", to_email)
        return False

    try:
        params: dict = {
            "from": f"weROI <{SENDER_EMAIL}>",
            "to": [to_email],
            "subject": subject,
            "html": html_content,
            "reply_to": reply_to or REPLY_TO_EMAIL,
        }
        if text_content:
            params["text"] = text_content
        if include_unsubscribe:
            params["headers"] = {
                "List-Unsubscribe": f"<mailto:{SENDER_EMAIL}?subject=unsubscribe>",
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            }

        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info("Email sent successfully to %s: %s", to_email, result)
        return True
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to_email, str(e))
        return False


async def _send_template_email(to_email: str, email_data: dict, include_unsubscribe: bool = False) -> bool:
    return await send_email_async(
        to_email,
        email_data["subject"],
        email_data["html"],
        email_data.get("text", ""),
        include_unsubscribe=include_unsubscribe,
    )


async def send_audit_confirmation(lead: AuditLead) -> bool:
    """Send free growth audit confirmation to the user."""
    email_data = get_audit_confirmation_email(lead.name, lead.company_name, CALENDLY_URL)
    return await _send_template_email(lead.email, email_data)


async def send_growth_audit_email(lead: AuditLead) -> bool:
    """Send personalized growth roadmap snapshot to the user."""
    email_data = get_growth_audit_email(
        lead.name,
        lead.company_name,
        lead.business_description,
        lead.services_interested,
        lead.timeline,
        CALENDLY_URL,
    )
    return await _send_template_email(lead.email, email_data)


async def send_audit_owner_notification(lead: AuditLead) -> bool:
    """Notify owner of a new audit lead."""
    email_data = get_audit_owner_notification_email(lead)
    return await _send_template_email(ADMIN_EMAIL, email_data)


async def send_audit_emails(lead: AuditLead) -> dict[str, bool]:
    """Send all audit-related emails: confirmation, growth snapshot, owner alert."""
    confirmation = await send_audit_confirmation(lead)
    growth = await send_growth_audit_email(lead)
    owner = await send_audit_owner_notification(lead)
    results = {
        "confirmation": confirmation,
        "growth_snapshot": growth,
        "owner_notification": owner,
    }
    sent = sum(results.values())
    if sent == len(results):
        logger.info("Audit emails sent for %s (%s/%s)", lead.email, sent, len(results))
    else:
        logger.error(
            "Audit email delivery incomplete for %s: %s (check RESEND_API_KEY and domain verification)",
            lead.email,
            results,
        )
    return results


async def send_email_sequence(lead_id: str, name: str, email: str, company_name: str = ""):
    """Send the 3-email guide drip sequence."""
    email_1 = get_email_1_content(name)
    success = await _send_template_email(email, email_1, include_unsubscribe=True)
    
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


@api_router.get("/health")
async def health():
    """Liveness probe for Railway — does not require MongoDB."""
    email_status = _email_config_status()
    mongo_url = os.environ.get("MONGO_URL")
    if not mongo_url:
        return {
            "status": "degraded",
            "database": "not_configured",
            "email": email_status,
            "hint": "Set MONGO_URL and DB_NAME in Railway Variables",
        }

    try:
        database = get_db()
        await database.command("ping")
        status = "ok" if email_status["resend_configured"] and not email_status["warnings"] else "degraded"
        return {
            "status": status,
            "database": "connected",
            "db_name": _db_name(),
            "email": email_status,
        }
    except Exception as exc:
        logger.warning("Health check: MongoDB ping failed: %s", exc)
        return {
            "status": "degraded",
            "database": "unreachable",
            "db_name": _db_name(),
            "email": email_status,
            "hint": "Check MongoDB Atlas Network Access allows 0.0.0.0/0 and password is URL-encoded",
            "error": str(exc),
        }

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
async def create_audit_lead(input: AuditLeadCreate):
    """Submit an audit form lead"""
    lead_obj = AuditLead(**input.model_dump())
    doc = lead_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.audit_leads.insert_one(doc)
    logger.info(f"New audit lead created: {lead_obj.email}")
    
    # Await delivery so emails are not dropped if the worker recycles after the response.
    await send_audit_emails(lead_obj)
    
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
    business_description: Optional[str] = None
    services_interested: Optional[List[str]] = None
    timeline: Optional[str] = None
    additional_details: Optional[str] = None
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
    
    writer.writerow(['Type', 'Date', 'Name', 'Email', 'Phone', 'Company', 'Website', 'Source', 'Services', 'Timeline', 'Business Description', 'Additional Details', 'Referrer', 'Status'])
    
    for lead in audit_leads:
        created = lead.get('created_at', '')
        if isinstance(created, datetime):
            created = created.strftime('%Y-%m-%d %H:%M')
        elif isinstance(created, str):
            created = created[:16].replace('T', ' ')
        services = lead.get('services_interested') or []
        if isinstance(services, list):
            services = ', '.join(services)
        writer.writerow([
            'Audit',
            created,
            lead.get('name', ''),
            lead.get('email', ''),
            lead.get('phone', ''),
            lead.get('company_name', ''),
            lead.get('website', ''),
            lead.get('how_found_us', ''),
            services,
            lead.get('timeline', ''),
            lead.get('business_description', ''),
            lead.get('additional_details', ''),
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
    
    processed_2 = 0
    processed_3 = 0
    
    # Find leads needing Email 2
    leads_for_email_2 = await db.guide_leads.find({
        "email_1_sent": True,
        "email_2_sent": False,
        "email_2_scheduled_for": {"$lte": now.isoformat()}
    }, {"_id": 0}).to_list(100)
    
    for lead in leads_for_email_2:
        email_2 = get_email_2_content(lead['name'], ANTI_DIY_PDF)
        success = await _send_template_email(lead['email'], email_2, include_unsubscribe=True)
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
        email_3 = get_email_3_content(lead['name'], company_name, AUDIT_URL)
        success = await _send_template_email(lead['email'], email_3, include_unsubscribe=True)
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
    if _mongo_client is not None:
        _mongo_client.close()

# ========================================
# BACKGROUND EMAIL SCHEDULER
# ========================================

async def process_scheduled_emails_job():
    """Background job to process scheduled emails (runs every 15 minutes)"""
    now = datetime.now(timezone.utc)
    
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
            email_2 = get_email_2_content(lead['name'], ANTI_DIY_PDF)
            success = await _send_template_email(lead['email'], email_2, include_unsubscribe=True)
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
            email_3 = get_email_3_content(lead['name'], company_name, AUDIT_URL)
            success = await _send_template_email(lead['email'], email_3, include_unsubscribe=True)
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
    mongo_url = os.environ.get("MONGO_URL")
    if not mongo_url:
        logger.error(
            "MONGO_URL is not set — API will return 503 on data routes. "
            "Add MONGO_URL and DB_NAME in Railway → Variables."
        )
    else:
        try:
            database = get_db()
            await database.command("ping")
            logger.info("MongoDB connected (db=%s)", _db_name())
        except Exception as exc:
            logger.error(
                "MongoDB ping failed at startup: %s. "
                "In Atlas → Network Access, allow 0.0.0.0/0 for Railway.",
                exc,
            )

    email_status = _email_config_status()
    if email_status["warnings"]:
        for warning in email_status["warnings"]:
            logger.warning("Email config: %s", warning)
    else:
        logger.info(
            "Email configured (sender=%s, admin=%s)",
            email_status["sender_email"],
            email_status["admin_email"],
        )

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
