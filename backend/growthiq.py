"""
GrowthIQ™ report generation — Groq or OpenAI with structured JSON fallback.
"""
from __future__ import annotations

import json
import logging
import os
import re
from html import unescape
from typing import Any
from urllib.parse import urljoin, urlparse

import requests

logger = logging.getLogger(__name__)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = os.environ.get("GROQ_MODEL") or os.environ.get("AI_MODEL", "llama-3.3-70b-versatile")
AI_PROVIDER = os.environ.get("AI_PROVIDER", "auto").lower()


def _resolve_ai_provider() -> tuple[str, str, str] | None:
    """Return (provider, api_key, model) or None for rule-based fallback."""
    if AI_PROVIDER == "groq" and GROQ_API_KEY:
        return ("groq", GROQ_API_KEY, GROQ_MODEL)
    if AI_PROVIDER == "openai" and OPENAI_API_KEY:
        return ("openai", OPENAI_API_KEY, OPENAI_MODEL)
    if AI_PROVIDER == "auto":
        if GROQ_API_KEY:
            return ("groq", GROQ_API_KEY, GROQ_MODEL)
        if OPENAI_API_KEY:
            return ("openai", OPENAI_API_KEY, OPENAI_MODEL)
    return None

CATEGORIES = [
    "website",
    "seo",
    "brand",
    "performance",
    "lead_gen",
    "ux",
    "accessibility",
    "trust",
    "marketing",
    "automation",
    "digital_presence",
]

GROWTH_LEVELS = [
    (0, 39, "Emerging"),
    (40, 59, "Growing"),
    (60, 79, "Established"),
    (80, 100, "Leading"),
]


def letter_grade(score: int) -> str:
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    if score >= 60:
        return "D"
    return "F"


def growth_level(score: int) -> str:
    for low, high, label in GROWTH_LEVELS:
        if low <= score <= high:
            return label
    return "Emerging"


def _hedged(text: str) -> str:
    if not text.startswith("Based on"):
        return f"Based on the information provided, {text[0].lower()}{text[1:]}" if text else text
    return text


def _presence_score(val: str) -> int:
    v = (val or "").lower()
    if v in ("yes", "active"):
        return 85
    if v in ("being built", "in progress", "partial"):
        return 55
    if v in ("not sure", "unsure", "unknown"):
        return 45
    return 25


def _normalize_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""
    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"
    return url


def _strip_tags(html: str) -> str:
    text = re.sub(r"<script[^>]*>[\s\S]*?</script>", " ", html, flags=re.I)
    text = re.sub(r"<style[^>]*>[\s\S]*?</style>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", unescape(text)).strip()


def _first_match(pattern: str, html: str, flags: int = re.I) -> str:
    m = re.search(pattern, html, flags)
    return _strip_tags(m.group(1)) if m else ""


def analyze_website(url: str, timeout: int = 12) -> dict[str, Any]:
    """Fetch homepage and extract verifiable signals. Never invent data."""
    normalized = _normalize_url(url)
    if not normalized:
        return {"success": False, "error": "No URL provided", "source": "none"}

    try:
        resp = requests.get(
            normalized,
            timeout=timeout,
            headers={"User-Agent": "GrowthIQ-Bot/1.0 (+https://weroi.net)"},
            allow_redirects=True,
        )
        final_url = resp.url
        html = resp.text or ""
        status = resp.status_code

        title = _first_match(r"<title[^>]*>([\s\S]*?)</title>", html)
        meta_desc = _first_match(
            r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']',
            html,
        ) or _first_match(
            r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']',
            html,
        )
        h1s = [
            _strip_tags(m)
            for m in re.findall(r"<h1[^>]*>([\s\S]*?)</h1>", html, flags=re.I)[:5]
        ]
        h1s = [h for h in h1s if h]

        nav_links = []
        for m in re.finditer(r"<nav[^>]*>([\s\S]*?)</nav>", html, flags=re.I):
            nav_html = m.group(1)
            for link in re.finditer(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>([\s\S]*?)</a>', nav_html, flags=re.I):
                href = link.group(1)
                label = _strip_tags(link.group(2))
                if label and not href.startswith(("#", "javascript:", "mailto:", "tel:")):
                    nav_links.append({"label": label[:80], "href": urljoin(final_url, href)[:200]})
            if nav_links:
                break

        cta_patterns = re.compile(
            r"<(a|button)[^>]*>([^<]*(?:contact|book|schedule|get started|sign up|buy|shop|quote|free|call|learn more)[^<]*)</\1>",
            re.I,
        )
        ctas = [_strip_tags(m.group(2))[:80] for m in cta_patterns.finditer(html)[:8]]
        ctas = list(dict.fromkeys([c for c in ctas if c]))

        has_viewport = bool(re.search(r'<meta[^>]+name=["\']viewport["\']', html, re.I))
        has_canonical = bool(re.search(r'<link[^>]+rel=["\']canonical["\']', html, re.I))
        has_og = bool(re.search(r'<meta[^>]+property=["\']og:', html, re.I))
        has_schema = bool(re.search(r"application/ld\+json", html, re.I))
        https = final_url.startswith("https://")

        trust_signals = []
        if https:
            trust_signals.append("HTTPS enabled")
        if re.search(r"(testimonial|review|trusted by|as seen in|certified|award)", html, re.I):
            trust_signals.append("Possible trust/review language detected on page")
        if re.search(r"(privacy policy|terms of service|terms and conditions)", html, re.I):
            trust_signals.append("Legal/policy pages referenced")

        img_count = len(re.findall(r"<img\b", html, re.I))
        alt_missing = len(re.findall(r"<img(?![^>]*\balt=)[^>]*>", html, re.I))

        return {
            "success": status < 400,
            "source": "live_fetch",
            "requested_url": normalized,
            "final_url": final_url,
            "status_code": status,
            "title": title,
            "meta_description": meta_desc,
            "h1_headings": h1s,
            "nav_links": nav_links[:12],
            "cta_texts": ctas,
            "seo_signals": {
                "has_viewport_meta": has_viewport,
                "has_canonical": has_canonical,
                "has_open_graph": has_og,
                "has_structured_data": has_schema,
                "https": https,
            },
            "trust_signals": trust_signals,
            "accessibility_signals": {
                "image_count": img_count,
                "images_missing_alt": alt_missing,
            },
            "content_length": len(html),
        }
    except requests.RequestException as exc:
        logger.warning("Website fetch failed for %s: %s", normalized, exc)
        return {
            "success": False,
            "source": "fetch_error",
            "requested_url": normalized,
            "error": str(exc),
        }


def _confidence_from_assessment(assessment: dict[str, Any], website_analysis: dict[str, Any] | None) -> int:
    score = 45
    if assessment.get("business_goals"):
        score += 10
    if assessment.get("industry"):
        score += 5
    presence = assessment.get("digital_presence") or {}
    answered = sum(1 for v in presence.values() if v)
    score += min(20, answered * 2)
    if website_analysis and website_analysis.get("success"):
        score += 20
    return min(95, score)


def _build_fallback_report(assessment: dict[str, Any], website_analysis: dict[str, Any] | None = None) -> dict[str, Any]:
    """Rule-based report when OpenAI is unavailable."""
    presence = assessment.get("digital_presence") or {}
    business = assessment.get("business_name") or "your business"
    industry = assessment.get("industry") or "your industry"
    goals = assessment.get("business_goals") or ""
    website = assessment.get("website") or ""
    has_website = presence.get("website", "").lower() in ("yes", "being built")

    scores: dict[str, int] = {}
    scores["website"] = _presence_score(presence.get("website", "no"))
    scores["seo"] = _presence_score(presence.get("seo", "no"))
    scores["brand"] = _presence_score(presence.get("brand_guidelines", "no"))
    scores["performance"] = _presence_score(presence.get("performance_optimization", "no"))
    scores["lead_gen"] = round(
        (_presence_score(presence.get("crm", "no")) + _presence_score(presence.get("email_marketing", "no"))) / 2
    )
    scores["ux"] = _presence_score(presence.get("website", "no"))
    scores["accessibility"] = _presence_score(presence.get("accessibility", "no"))
    scores["trust"] = round(
        (
            _presence_score(presence.get("online_reviews", "no"))
            + _presence_score(presence.get("ssl", "no"))
        )
        / 2
    )
    scores["marketing"] = round(
        (
            _presence_score(presence.get("social_media", "no"))
            + _presence_score(presence.get("paid_ads", "no"))
            + _presence_score(presence.get("blog", "no"))
        )
        / 3
    )
    scores["automation"] = _presence_score(presence.get("automation", "no"))
    scores["digital_presence"] = round(sum(scores.values()) / len(scores))

    overall = round(sum(scores.values()) / len(scores))

    def cat(name: str, label: str, explanation: str, strengths: list, weaknesses: list, recs: list, priority: str):
        s = scores[name]
        return {
            "key": name,
            "label": label,
            "score": s,
            "explanation": _hedged(explanation),
            "strengths": strengths,
            "weaknesses": weaknesses,
            "priority_level": priority,
            "recommendations": recs,
        }

    categories = []
    if not has_website:
        categories.append(
            cat(
                "website",
                "Website Quality",
                f"It appears {business} may not have a live website yet. A professional site is often the foundation for credibility and lead capture in {industry}.",
                ["Clear opportunity to build a strong first impression"] if presence.get("website") == "being built" else [],
                ["No live website detected", "Potential customers may struggle to verify your business online"],
                [
                    "Launch a mobile-responsive website with clear service pages and contact paths",
                    "Include trust signals: testimonials, location, and a simple lead form",
                ],
                "High",
            )
        )
    else:
        categories.append(
            cat(
                "website",
                "Website Quality",
                f"Based on your responses, {business} appears to have a website. Further expert review could validate conversion paths and messaging.",
                ["Website presence established"],
                ["Conversion optimization may need review", "Content depth unknown without live audit"],
                ["Audit key landing pages for clarity and calls to action", "Ensure mobile performance meets modern standards"],
                "Medium",
            )
        )

    seo_val = presence.get("seo", "no").lower()
    categories.append(
        cat(
            "seo",
            "SEO & Discoverability",
            f"SEO status: {seo_val}. "
            + (
                "It appears discoverability may be limited without active SEO."
                if seo_val in ("no", "not sure")
                else "Some SEO foundation may exist; optimization could unlock additional organic traffic."
            ),
            ["SEO awareness"] if seo_val == "yes" else [],
            ["Limited organic visibility potential"] if seo_val != "yes" else ["Competitive keywords may need targeting"],
            [
                "Claim and optimize Google Business Profile if local",
                "Target 3 to 5 high-intent keywords for your services",
                "Publish helpful content answering customer questions",
            ],
            "High" if seo_val != "yes" else "Medium",
        )
    )

    categories.append(
        cat(
            "brand",
            "Brand Consistency",
            f"Brand guidelines status: {presence.get('brand_guidelines', 'not sure')}. Consistent branding typically improves trust and recognition.",
            ["Brand foundation may exist"] if presence.get("brand_guidelines") == "yes" else [],
            ["Inconsistent visuals or messaging may reduce trust"] if presence.get("brand_guidelines") != "yes" else [],
            ["Document core colors, fonts, and tone of voice", "Align website and social profiles to one visual system"],
            "Medium",
        )
    )

    categories.append(
        cat(
            "performance",
            "Performance",
            f"Performance optimization: {presence.get('performance_optimization', 'not sure')}. Fast experiences often correlate with better engagement.",
            [] if presence.get("performance_optimization") != "yes" else ["Performance awareness noted"],
            ["Slow load times may increase bounce rates"] if presence.get("performance_optimization") != "yes" else [],
            ["Compress images and enable caching", "Test Core Web Vitals on mobile"],
            "Medium",
        )
    )

    categories.append(
        cat(
            "lead_gen",
            "Lead Generation",
            f"CRM: {presence.get('crm', 'no')}, email marketing: {presence.get('email_marketing', 'no')}.",
            ["Lead capture systems may be partially in place"] if presence.get("crm") == "yes" else [],
            ["Leads may be lost without structured follow-up"] if presence.get("crm") != "yes" else [],
            ["Add a simple lead form on every key page", "Set up automated follow-up within 24 hours"],
            "High" if presence.get("crm") != "yes" else "Low",
        )
    )

    categories.append(
        cat(
            "ux",
            "User Experience",
            "It appears navigation clarity and mobile usability are important growth levers for your visitors.",
            ["Opportunity to refine user journeys"],
            ["Friction in booking or contact flows may reduce conversions"],
            ["Simplify navigation to 5 or fewer primary items", "Make phone, email, and booking one tap away on mobile"],
            "Medium",
        )
    )

    categories.append(
        cat(
            "accessibility",
            "Accessibility",
            f"Accessibility status: {presence.get('accessibility', 'not sure')}. Inclusive design expands reach and may reduce legal risk.",
            [] if presence.get("accessibility") != "yes" else ["Accessibility considered"],
            ["Potential barriers for some users"] if presence.get("accessibility") != "yes" else [],
            ["Add alt text to images", "Ensure sufficient color contrast and keyboard navigation"],
            "Low" if presence.get("accessibility") == "yes" else "Medium",
        )
    )

    categories.append(
        cat(
            "trust",
            "Trust & Credibility",
            f"Reviews: {presence.get('online_reviews', 'no')}, SSL: {presence.get('ssl', 'not sure')}.",
            ["Trust signals may exist"] if presence.get("online_reviews") == "yes" else [],
            ["Social proof may be underutilized"] if presence.get("online_reviews") != "yes" else [],
            ["Collect and display recent client reviews", "Ensure HTTPS across all pages"],
            "Medium",
        )
    )

    categories.append(
        cat(
            "marketing",
            "Marketing Channels",
            f"Social: {presence.get('social_media', 'no')}, paid ads: {presence.get('paid_ads', 'no')}, blog: {presence.get('blog', 'no')}.",
            ["Active marketing channels noted"] if presence.get("social_media") == "yes" else [],
            ["Channel mix may be underdeveloped"] if presence.get("social_media") != "yes" else [],
            ["Choose 1 to 2 primary channels and post consistently", "Repurpose website content into short-form posts"],
            "Medium",
        )
    )

    categories.append(
        cat(
            "automation",
            "Automation",
            f"Automation status: {presence.get('automation', 'not sure')}.",
            ["Some automation may exist"] if presence.get("automation") == "yes" else [],
            ["Manual workflows may limit scale"] if presence.get("automation") != "yes" else [],
            ["Automate appointment reminders and lead routing", "Connect forms to CRM or email sequences"],
            "Medium" if presence.get("automation") != "yes" else "Low",
        )
    )

    categories.append(
        cat(
            "digital_presence",
            "Digital Presence",
            f"Overall digital footprint for {business} in {industry} shows room to strengthen how customers discover and evaluate you online.",
            ["Clear growth path identified"],
            ["Gaps across multiple digital touchpoints"],
            ["Prioritize website, SEO, and lead capture in the next 90 days"],
            "High",
        )
    )

    top_opportunities = [
        "Strengthen website as a conversion hub" if not has_website else "Optimize website conversion paths",
        "Improve SEO and local discoverability",
        "Implement structured lead follow-up",
        "Build consistent brand across channels",
        "Add analytics to guide decisions" if presence.get("analytics") != "yes" else "Expand analytics-driven optimization",
    ]

    quick_wins = [
        "Add a clear call to action above the fold",
        "Claim or update Google Business Profile",
        "Enable SSL if not already active",
        "Set up basic analytics tracking",
        "Collect 3 recent client testimonials",
    ]

    long_term = [
        "Content marketing engine for organic growth",
        "Marketing automation and CRM integration",
        "Paid acquisition with measured ROI",
        "Accessibility and performance optimization program",
    ]

    risks = [
        "Potential loss of leads without structured follow-up",
        "Competitors with stronger SEO may capture search demand",
        "Inconsistent brand may reduce perceived credibility",
    ]
    if presence.get("analytics") != "yes":
        risks.append("Limited data may hinder confident growth decisions")

    roadmap = [
        {"phase": "30 days", "focus": "Foundation", "actions": ["Launch or fix website basics", "Set up analytics", "Claim GBP"]},
        {"phase": "60 days", "focus": "Visibility", "actions": ["On-page SEO", "Review generation", "Social consistency"]},
        {"phase": "90 days", "focus": "Conversion", "actions": ["Lead automation", "Landing page tests", "Content cadence"]},
    ]

    summary = (
        f"Based on the information provided, {business} shows a GrowthIQ score of {overall}/100 "
        f"({growth_level(overall)}). "
        f"Primary goal noted: {assessment.get('primary_goal', 'growth')}. "
        "This assessment reflects self-reported data and is not a guarantee of results. "
        "A full expert review could validate findings against your live digital presence."
    )

    if goals:
        summary += f" Your stated priorities suggest focus on: {goals[:200]}{'...' if len(goals) > 200 else ''}."

    business_summary = (
        f"{business} operates in {industry}. "
        f"Primary goal: {assessment.get('primary_goal', 'growth')}. "
        f"Business size: {assessment.get('business_size', 'not specified')}."
    )
    if website_analysis and website_analysis.get("success"):
        business_summary += f" Live website analyzed: {website_analysis.get('final_url', '')}."
    elif website:
        business_summary += " Website URL provided but live analysis was unavailable."

    confidence = _confidence_from_assessment(assessment, website_analysis)
    potential_impact = [
        "Website conversion optimization",
        "SEO and local discoverability",
        "Lead capture and follow-up",
    ]
    if presence.get("automation") != "yes":
        potential_impact.append("Marketing automation")
    if presence.get("social_media") != "yes":
        potential_impact.append("Social media presence")

    report = {
        "overall_score": overall,
        "letter_grade": letter_grade(overall),
        "growth_level": growth_level(overall),
        "executive_summary": summary,
        "business_summary": business_summary,
        "confidence_score": confidence,
        "potential_impact_areas": potential_impact[:5],
        "website_analysis_used": bool(website_analysis and website_analysis.get("success")),
        "top_next_actions": [
            top_opportunities[0],
            "Set up analytics and baseline KPIs",
            "Request expert review for validated roadmap",
        ],
        "categories": categories,
        "top_opportunities": top_opportunities[:5],
        "quick_wins": quick_wins[:5],
        "long_term_opportunities": long_term,
        "potential_risks": risks,
        "investment_priorities": [
            "Website and conversion foundation",
            "SEO and local visibility",
            "Lead capture and follow-up systems",
        ],
        "suggested_roadmap": roadmap,
        "estimated_growth_impact": (
            "Potential opportunity: businesses that address website, SEO, and lead systems often see "
            "meaningful improvements in visibility and inquiry volume. Results vary and are not guaranteed."
        ),
        "whats_included": _whats_included_summary(),
    }
    return report


def _whats_included_summary() -> list[str]:
    return [
        "Overall Digital Growth Score",
        "Website Quality",
        "SEO",
        "Brand",
        "Trust",
        "Conversion",
        "Lead Gen",
        "UX",
        "Performance",
        "Accessibility",
        "Content",
        "CTAs",
        "Competitive Positioning",
        "Digital Maturity",
        "Growth Priorities",
        "Top Opportunities",
        "Quick Wins",
        "Long-Term Recommendations",
        "Estimated Growth Impact (potential, not guaranteed)",
    ]


SYSTEM_PROMPT = """You are GrowthIQ™, the AI assessment engine for weROI digital growth agency.
Generate a personalized digital growth assessment report as valid JSON only.

Rules:
- Use hedged language: "Based on the information provided...", "It appears...", "Potential opportunity..."
- NO guarantees of revenue, rankings, or specific outcomes
- Reference the user's actual answers (missing website, no SEO, no analytics, etc.)
- If website_analysis is provided, cite only verified signals from that object (title, meta, h1, nav, CTAs, SEO/trust signals). Label source as "live website analysis" when used.
- NEVER invent website data not present in website_analysis
- Scores 0-100 per category; overall_score is weighted average
- priority_level: High, Medium, or Low
- growth_level: Emerging (0-39), Growing (40-59), Established (60-79), Leading (80-100)
- letter_grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- confidence_score: 0-100 reflecting how much reliable data was available
- business_summary: 2-3 sentence overview of the business
- potential_impact_areas: list of 3-5 areas where improvements could have the most impact (potential, not guaranteed)

Return JSON matching this schema:
{
  "overall_score": number,
  "letter_grade": string,
  "growth_level": string,
  "executive_summary": string,
  "business_summary": string,
  "confidence_score": number,
  "potential_impact_areas": [string],
  "top_next_actions": [string, string, string],
  "categories": [{
    "key": string,
    "label": string,
    "score": number,
    "explanation": string,
    "strengths": [string],
    "weaknesses": [string],
    "priority_level": string,
    "recommendations": [string]
  }],
  "top_opportunities": [string],
  "quick_wins": [string],
  "long_term_opportunities": [string],
  "potential_risks": [string],
  "investment_priorities": [string],
  "suggested_roadmap": [{"phase": string, "focus": string, "actions": [string]}],
  "estimated_growth_impact": string
}

Include all category keys: website, seo, brand, performance, lead_gen, ux, accessibility, trust, marketing, automation, digital_presence.
"""


def _extract_json(text: str) -> dict[str, Any]:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return json.loads(text)


async def generate_growthiq_report(
    assessment: dict[str, Any],
    website_analysis: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Generate report via OpenAI or fallback."""
    if website_analysis is None:
        website_url = assessment.get("website") or assessment.get("website_url") or ""
        presence = assessment.get("digital_presence") or {}
        if isinstance(presence, dict) and presence.get("website", "").lower() == "yes" and website_url:
            website_analysis = analyze_website(website_url)

    resolved = _resolve_ai_provider()
    if not resolved:
        logger.info("No AI provider configured — using rule-based GrowthIQ report")
        report = _build_fallback_report(assessment, website_analysis)
        report["generation_mode"] = "fallback"
        if website_analysis:
            report["website_analysis_used"] = bool(website_analysis.get("success"))
        return report

    provider, api_key, model = resolved
    try:
        from openai import AsyncOpenAI

        client_kwargs: dict[str, Any] = {"api_key": api_key}
        if provider == "groq":
            client_kwargs["base_url"] = "https://api.groq.com/openai/v1"

        client = AsyncOpenAI(**client_kwargs)
        payload = {**assessment}
        if website_analysis:
            payload["website_analysis"] = website_analysis
        user_content = json.dumps(payload, indent=2)
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Assessment data:\n{user_content}"},
            ],
            temperature=0.4,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content or "{}"
        report = _extract_json(raw)
        report["whats_included"] = _whats_included_summary()
        report["generation_mode"] = provider
        if website_analysis:
            report["website_analysis_used"] = bool(website_analysis.get("success"))
        if "confidence_score" not in report:
            report["confidence_score"] = _confidence_from_assessment(assessment, website_analysis)
        return report
    except Exception as exc:
        logger.error("%s GrowthIQ generation failed: %s", provider, exc)
        report = _build_fallback_report(assessment, website_analysis)
        report["generation_mode"] = f"fallback_{provider}_error"
        return report
