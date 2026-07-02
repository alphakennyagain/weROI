from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Query, Response, Request, Body
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
import re
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
    get_growthiq_meeting_email,
    get_visibility_checklist_email_content,
    get_email_2_content,
    get_email_3_content,
    get_growth_audit_email,
)
from growthiq import analyze_website, answer_growthiq_chat, generate_growthiq_report

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
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'Zachattack01@')


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
    name: str = ""
    email: EmailStr
    referrer: Optional[str] = None
    source: Optional[str] = "guide"

class GuideLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    email: EmailStr
    referrer: Optional[str] = None
    source: str = "guide"
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

# GrowthIQ™ Assessment Models
CRM_STATUSES = [
    "analytics_only",
    "expert_review_requested",
    "contacted",
    "proposal_sent",
    "won",
    "lost",
]


def _normalize_email(value: str | None) -> str:
    return str(value or "").strip().lower()


def _growthiq_email_query(email: str) -> dict:
    """Case-insensitive match for business_email (legacy + normalized field)."""
    norm = _normalize_email(email)
    return {
        "$or": [
            {"business_email_normalized": norm},
            {"$expr": {"$eq": [{"$toLower": {"$ifNull": ["$business_email", ""]}}, norm]}},
        ]
    }


def _emails_match(stored: str | None, provided: str | None) -> bool:
    return _normalize_email(stored) == _normalize_email(provided)


class DigitalPresence(BaseModel):
    website: str = ""
    seo: str = ""
    brand_guidelines: str = ""
    social_media: str = ""
    gbp: str = ""
    email_marketing: str = ""
    crm: str = ""
    analytics: str = ""
    paid_ads: str = ""
    online_booking: str = ""
    automation: str = ""
    blog: str = ""
    live_chat: str = ""
    online_reviews: str = ""
    accessibility: str = ""
    ssl: str = ""
    performance_optimization: str = ""

class GrowthAssessmentCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    full_name: str
    business_name: str
    business_email: EmailStr
    phone: str
    country: str
    preferred_contact: str
    industry: str
    business_size: str
    years_in_business: str
    primary_goal: str
    website: Optional[str] = None
    website_url: Optional[str] = None
    social_links: Optional[str] = None
    google_business_profile: Optional[str] = None
    digital_presence: DigitalPresence = Field(default_factory=DigitalPresence)
    business_goals: str
    referrer: Optional[str] = None
    analytics_tools: Optional[list] = None
    automation_tools: Optional[list] = None
    social_platforms: Optional[list] = None

class GrowthAssessment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    report_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    business_name: str
    business_email: EmailStr
    phone: str
    country: str
    preferred_contact: str
    industry: str
    business_size: str
    years_in_business: str
    primary_goal: str
    website: Optional[str] = None
    website_url: Optional[str] = None
    social_links: Optional[str] = None
    google_business_profile: Optional[str] = None
    digital_presence: DigitalPresence = Field(default_factory=DigitalPresence)
    business_goals: str
    referrer: Optional[str] = None
    website_analysis: Optional[dict] = None
    report: Optional[dict] = None
    crm_status: str = "analytics_only"
    expert_review_requested: bool = False
    expert_review_requested_at: Optional[str] = None
    meeting_link_sent_at: Optional[str] = None
    internal_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GrowthExpertReviewRequest(BaseModel):
    report_id: str

class GrowthAssessmentUpdate(BaseModel):
    crm_status: Optional[str] = None
    internal_notes: Optional[str] = None
    full_name: Optional[str] = None
    business_email: Optional[EmailStr] = None
    phone: Optional[str] = None

class GrowthIQGenerateRequest(BaseModel):
    assessment: dict

class GrowthIQChatRequest(BaseModel):
    message: str = Field(..., max_length=500)

class GrowthIQReportLookup(BaseModel):
    email: EmailStr

class GrowthIQMeetingLinkRequest(BaseModel):
    calendly_url: Optional[str] = Field(None, max_length=500)
    proposed_times: Optional[str] = Field(None, max_length=500)
    personal_message: Optional[str] = Field(None, max_length=1200)

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


async def send_checklist_email(lead_id: str, email: str, name: str = ""):
    """Send visibility checklist email immediately (exit-intent lead magnet)."""
    prior_name = name.strip()
    if not prior_name:
        growthiq = await db.growth_assessments.find_one(
            {"business_email": email},
            {"_id": 0, "full_name": 1},
            sort=[("created_at", -1)],
        )
        if growthiq and growthiq.get("full_name"):
            prior_name = growthiq["full_name"]

    email_content = get_visibility_checklist_email_content(prior_name or None)
    success = await _send_template_email(email, email_content, include_unsubscribe=True)
    if success:
        await db.guide_leads.update_one(
            {"id": lead_id},
            {"$set": {"email_1_sent": True}},
        )
        logger.info("Checklist email sent to %s", email)
    return success


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
    return {
        "message": "weROI API",
        "growthiq": True,
        "commit": os.environ.get("RAILWAY_GIT_COMMIT_SHA")
        or os.environ.get("VERCEL_GIT_COMMIT_SHA")
        or "local",
    }


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
            "growthiq": True,
            "report_lookup": True,
            "meeting_link_send": True,
            "commit": os.environ.get("RAILWAY_GIT_COMMIT_SHA")
            or os.environ.get("VERCEL_GIT_COMMIT_SHA")
            or "local",
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

# ========================================
# GROWTHIQ™ ASSESSMENT ROUTES
# ========================================

@api_router.post("/growthiq/generate")
async def generate_growthiq(input: GrowthIQGenerateRequest):
    """Generate AI GrowthIQ report from assessment answers."""
    report = await generate_growthiq_report(input.assessment)
    return {"report": report}

@api_router.post("/growthiq/chat")
async def growthiq_chat(input: GrowthIQChatRequest):
    """Lightweight GrowthIQ assistant — short answers, token-capped."""
    reply = await answer_growthiq_chat(input.message)
    return {"reply": reply}

@api_router.post("/growthiq/assessment", response_model=GrowthAssessment)
async def create_growth_assessment(input: GrowthAssessmentCreate, background_tasks: BackgroundTasks):
    """Submit assessment, generate report, store with unique report ID."""
    assessment_data = input.model_dump()
    website_url = assessment_data.get("website") or assessment_data.get("website_url")
    presence = assessment_data.get("digital_presence") or {}
    if hasattr(presence, "model_dump"):
        presence = presence.model_dump()
    website_analysis = None
    if website_url and (presence.get("website") or "").lower() == "yes":
        website_analysis = analyze_website(website_url)

    report = await generate_growthiq_report(assessment_data, website_analysis)

    assessment_obj = GrowthAssessment(
        **assessment_data,
        website_analysis=website_analysis,
        report=report,
        crm_status="analytics_only",
        expert_review_requested=False,
    )
    doc = assessment_obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["updated_at"] = doc["updated_at"].isoformat()
    if doc.get("digital_presence"):
        doc["digital_presence"] = (
            doc["digital_presence"].model_dump()
            if hasattr(doc["digital_presence"], "model_dump")
            else doc["digital_presence"]
        )

    doc["business_email_normalized"] = str(assessment_obj.business_email).strip().lower()
    await db.growth_assessments.insert_one(doc)
    logger.info("GrowthIQ assessment created: %s (%s)", assessment_obj.report_id, assessment_obj.business_email)

    # Notify admin only for analytics storage (not active sales lead yet)
    background_tasks.add_task(_notify_growthiq_analytics, assessment_obj)

    return assessment_obj

async def _notify_growthiq_analytics(assessment: GrowthAssessment):
    """Lightweight admin notification for new assessment (analytics)."""
    if not resend.api_key:
        return
    subject = f"GrowthIQ™ Assessment: {assessment.business_name} (analytics)"
    html = f"""
    <p>New GrowthIQ™ assessment completed (analytics only, no expert review yet).</p>
    <ul>
      <li><strong>Report ID:</strong> {assessment.report_id}</li>
      <li><strong>Business:</strong> {assessment.business_name}</li>
      <li><strong>Contact:</strong> {assessment.full_name} ({assessment.business_email})</li>
      <li><strong>Score:</strong> {(assessment.report or {}).get('overall_score', 'N/A')}</li>
      <li><strong>Industry:</strong> {assessment.industry}</li>
    </ul>
    """
    await send_email_async(ADMIN_EMAIL, subject, html)

@api_router.post("/growthiq/expert-review")
async def request_expert_review(input: GrowthExpertReviewRequest, background_tasks: BackgroundTasks):
    """User requests free expert growth review — becomes active sales lead."""
    result = await db.growth_assessments.update_one(
        {"report_id": input.report_id},
        {"$set": {
            "expert_review_requested": True,
            "expert_review_requested_at": datetime.now(timezone.utc).isoformat(),
            "crm_status": "expert_review_requested",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")

    assessment_doc = await db.growth_assessments.find_one({"report_id": input.report_id}, {"_id": 0})
    background_tasks.add_task(_notify_expert_review_requested, assessment_doc)
    return {"status": "expert_review_requested", "report_id": input.report_id}

async def _notify_expert_review_requested(doc: dict):
    """Notify admin of expert review request."""
    if not resend.api_key:
        return
    report = doc.get("report") or {}
    subject = f"🔥 GrowthIQ Expert Review Requested: {doc.get('business_name')}"
    html = f"""
    <p><strong>Expert review requested</strong> for GrowthIQ™ assessment.</p>
    <ul>
      <li><strong>Report ID:</strong> {doc.get('report_id')}</li>
      <li><strong>Business:</strong> {doc.get('business_name')}</li>
      <li><strong>Contact:</strong> {doc.get('full_name')} ({doc.get('business_email')})</li>
      <li><strong>Phone:</strong> {doc.get('phone')}</li>
      <li><strong>Preferred contact:</strong> {doc.get('preferred_contact')}</li>
      <li><strong>Score:</strong> {report.get('overall_score', 'N/A')} ({report.get('growth_level', '')})</li>
      <li><strong>Industry:</strong> {doc.get('industry')}</li>
      <li><strong>Primary goal:</strong> {doc.get('primary_goal')}</li>
    </ul>
    <p>View full report in admin dashboard.</p>
    """
    await send_email_async(ADMIN_EMAIL, subject, html)
    # Confirmation to user
    user_html = f"""
    <p>Hi {doc.get('full_name')},</p>
    <p>Thank you for requesting your free expert growth review from weROI. Our team will review your GrowthIQ™ report and reach out within 48 hours.</p>
    <p>Report ID: {doc.get('report_id')}</p>
    """
    await send_email_async(doc.get("business_email", ""), "Your weROI Expert Growth Review Request", user_html)

@api_router.post("/growthiq/maybe-later")
async def growthiq_maybe_later(input: GrowthExpertReviewRequest):
    """User declined expert review — store for analytics only."""
    result = await db.growth_assessments.update_one(
        {"report_id": input.report_id},
        {"$set": {
            "expert_review_requested": False,
            "crm_status": "analytics_only",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"status": "saved", "report_id": input.report_id}

@api_router.get("/growthiq/assessment/{report_id}")
async def get_growth_assessment(report_id: str, email: Optional[EmailStr] = Query(None)):
    """Retrieve assessment by report ID. Public access requires matching email."""
    doc = await db.growth_assessments.find_one({"report_id": report_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Report not found")
    if email is not None:
        if not _emails_match(doc.get("business_email"), str(email)):
            raise HTTPException(status_code=403, detail="Email does not match this report")
    return doc

@api_router.post("/growthiq/reports/lookup")
async def lookup_growthiq_reports(body: GrowthIQReportLookup):
    """Return compact report summaries for a business email (max 20, newest first)."""
    email = _normalize_email(str(body.email))
    assessments = await db.growth_assessments.find(
        _growthiq_email_query(email),
        {
            "_id": 0,
            "report_id": 1,
            "business_name": 1,
            "business_email": 1,
            "created_at": 1,
            "expert_review_requested": 1,
            "report.overall_score": 1,
            "report.letter_grade": 1,
            "report.growth_level": 1,
        },
    ).sort("created_at", -1).to_list(20)

    return {
        "reports": [
            {
                "report_id": a.get("report_id"),
                "business_name": a.get("business_name"),
                "business_email": a.get("business_email"),
                "created_at": a.get("created_at"),
                "expert_review_requested": bool(a.get("expert_review_requested")),
                "overall_score": (a.get("report") or {}).get("overall_score"),
                "letter_grade": (a.get("report") or {}).get("letter_grade"),
                "growth_level": (a.get("report") or {}).get("growth_level"),
            }
            for a in assessments
        ]
    }

@api_router.get("/growthiq/assessments")
async def list_growth_assessments(
    password: str = Query(...),
    industry: Optional[str] = None,
    business_size: Optional[str] = None,
    min_score: Optional[int] = None,
    crm_status: Optional[str] = None,
):
    """Admin: list GrowthIQ assessments with filters."""
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")

    query: dict = {}
    if industry:
        query["industry"] = industry
    if business_size:
        query["business_size"] = business_size
    if crm_status:
        query["crm_status"] = crm_status
    if min_score is not None:
        query["report.overall_score"] = {"$gte": min_score}

    assessments = await db.growth_assessments.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return assessments

@api_router.put("/growthiq/assessment/{report_id}")
async def update_growth_assessment(report_id: str, update: GrowthAssessmentUpdate, password: str = Query(...)):
    """Admin: update CRM status and internal notes."""
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")

    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    if update_data.get("crm_status") and update_data["crm_status"] not in CRM_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid crm_status. Use: {CRM_STATUSES}")

    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.growth_assessments.update_one({"report_id": report_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")

    updated = await db.growth_assessments.find_one({"report_id": report_id}, {"_id": 0})
    return updated

@api_router.post("/growthiq/assessment/{report_id}/send-meeting-link")
async def send_growthiq_meeting_link(
    report_id: str,
    body: GrowthIQMeetingLinkRequest = Body(default_factory=GrowthIQMeetingLinkRequest),
    password: str = Query(...),
):
    """Admin: email Calendly booking link to assessment contact."""
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")

    doc = await db.growth_assessments.find_one({"report_id": report_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Report not found")

    email = doc.get("business_email")
    if not email:
        raise HTTPException(status_code=400, detail="Assessment has no email on file")

    calendly_url = (body.calendly_url or "").strip() or CALENDLY_URL
    if not calendly_url.startswith("http"):
        raise HTTPException(status_code=400, detail="Calendly URL must start with http:// or https://")

    name = doc.get("full_name") or ""
    business = doc.get("business_name") or "your business"
    report = doc.get("report") or {}
    email_content = get_growthiq_meeting_email(
        name,
        business,
        calendly_url,
        proposed_times=body.proposed_times,
        personal_message=body.personal_message,
        overall_score=report.get("overall_score"),
        letter_grade=report.get("letter_grade"),
    )
    success = await _send_template_email(email, email_content, include_unsubscribe=True)
    if not success:
        raise HTTPException(
            status_code=502,
            detail="Email could not be sent. Check RESEND_API_KEY and sender domain.",
        )

    now = datetime.now(timezone.utc).isoformat()
    update_fields: dict = {
        "meeting_link_sent_at": now,
        "updated_at": now,
        "last_meeting_calendly_url": calendly_url,
    }
    if body.proposed_times and body.proposed_times.strip():
        update_fields["last_meeting_proposed_times"] = body.proposed_times.strip()
    if body.personal_message and body.personal_message.strip():
        update_fields["last_meeting_personal_message"] = body.personal_message.strip()
    if doc.get("crm_status") in (None, "", "analytics_only", "expert_review_requested"):
        update_fields["crm_status"] = "contacted"

    await db.growth_assessments.update_one({"report_id": report_id}, {"$set": update_fields})
    updated = await db.growth_assessments.find_one({"report_id": report_id}, {"_id": 0})
    logger.info("Meeting link sent to %s for report %s", email, report_id)
    return {"status": "sent", "report_id": report_id, "email": email, "assessment": updated}

@api_router.get("/growthiq/export/csv")
async def export_growthiq_csv(password: str = Query(...)):
    """Admin: export GrowthIQ assessments to CSV."""
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")

    assessments = await db.growth_assessments.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Report ID", "Date", "Name", "Email", "Phone", "Business", "Industry", "Size",
        "Score", "Grade", "Growth Level", "CRM Status", "Expert Review", "Primary Goal", "Website",
    ])
    for a in assessments:
        created = a.get("created_at", "")
        if isinstance(created, datetime):
            created = created.strftime("%Y-%m-%d %H:%M")
        elif isinstance(created, str):
            created = created[:16].replace("T", " ")
        report = a.get("report") or {}
        writer.writerow([
            a.get("report_id", ""),
            created,
            a.get("full_name", ""),
            a.get("business_email", ""),
            a.get("phone", ""),
            a.get("business_name", ""),
            a.get("industry", ""),
            a.get("business_size", ""),
            report.get("overall_score", ""),
            report.get("letter_grade", ""),
            report.get("growth_level", ""),
            a.get("crm_status", ""),
            "Yes" if a.get("expert_review_requested") else "No",
            a.get("primary_goal", ""),
            a.get("website", ""),
        ])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=growthiq_{datetime.now().strftime('%Y%m%d')}.csv"},
    )

@api_router.delete("/growthiq/assessment/{report_id}")
async def delete_growth_assessment(report_id: str, password: str = Query(...)):
    """Admin: delete a GrowthIQ assessment."""
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    result = await db.growth_assessments.delete_one({"report_id": report_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"deleted": True, "report_id": report_id}

@api_router.post("/leads/guide", response_model=GuideLead)
async def create_guide_lead(input: GuideLeadCreate, background_tasks: BackgroundTasks):
    """Submit a guide/checklist lead and trigger the appropriate email."""
    lead_obj = GuideLead(**input.model_dump())
    doc = lead_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.guide_leads.insert_one(doc)
    logger.info("New guide lead created: %s (source=%s)", lead_obj.email, lead_obj.source)
    
    if (input.source or "").strip().lower() == "exit_intent_checklist":
        background_tasks.add_task(send_checklist_email, lead_obj.id, input.email, input.name or "")
    else:
        background_tasks.add_task(
            send_email_sequence,
            lead_obj.id,
            input.name or "there",
            input.email,
            "",
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
    growth_assessments = await db.growth_assessments.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
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
        "growth_assessments": growth_assessments,
        "stats": {
            "total_unique_visitors": total_unique_visitors,
            "total_page_views": total_page_views,
            "total_audit_leads": len(audit_leads),
            "total_guide_leads": len(guide_leads),
            "total_growth_assessments": len(growth_assessments),
            "growth_expert_reviews": sum(1 for g in growth_assessments if g.get("expert_review_requested")),
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
            updated = 0
            cursor = db.growth_assessments.find(
                {"business_email_normalized": {"$exists": False}, "business_email": {"$exists": True, "$ne": ""}},
                {"report_id": 1, "business_email": 1},
            )
            async for row in cursor:
                await db.growth_assessments.update_one(
                    {"report_id": row["report_id"]},
                    {"$set": {"business_email_normalized": _normalize_email(row.get("business_email"))}},
                )
                updated += 1
            if updated:
                logger.info("Backfilled business_email_normalized on %s assessments", updated)
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
