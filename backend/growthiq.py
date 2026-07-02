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


def score_label(score: int) -> str:
    """Human-readable label for category/overall scores."""
    if score >= 85:
        return "Strong"
    if score >= 60:
        return "Needs Attention"
    return "Priority Area"


CATEGORY_DISPLAY = {
    "website": "Website Experience",
    "seo": "SEO Potential",
    "brand": "Brand & Trust",
    "performance": "Performance",
    "lead_gen": "Lead Generation",
    "ux": "User Experience",
    "accessibility": "Accessibility",
    "trust": "Trust & Credibility",
    "marketing": "Marketing Channels",
    "automation": "Automation Readiness",
    "digital_presence": "Digital Presence",
}

PRESENCE_LABELS = {
    "website": "Website",
    "seo": "SEO",
    "brand_guidelines": "Brand guidelines",
    "social_media": "Social media",
    "gbp": "Google Business Profile",
    "email_marketing": "Email marketing",
    "crm": "CRM",
    "analytics": "Analytics",
    "paid_ads": "Paid ads",
    "online_booking": "Online booking",
    "automation": "Automation",
    "blog": "Blog",
    "live_chat": "Live chat",
    "online_reviews": "Online reviews",
    "accessibility": "Accessibility",
    "ssl": "SSL certificate",
    "performance_optimization": "Performance optimization",
}

VISIBILITY_KEYS = (
    "website",
    "seo",
    "gbp",
    "social_media",
    "online_reviews",
    "analytics",
    "email_marketing",
    "crm",
)


def _primary_goal_label(assessment: dict[str, Any]) -> str:
    goal = (assessment.get("primary_goal") or "").strip()
    if goal == "Other":
        return (assessment.get("primary_goal_other") or "Custom growth goal").strip()
    return goal or "Grow the business"


def _presence_answer(presence: dict[str, Any], key: str) -> str:
    return (presence.get(key) or "Not Sure").strip()


def _build_business_snapshot(
    assessment: dict[str, Any],
    website_analysis: dict[str, Any] | None = None,
) -> dict[str, Any]:
    presence = assessment.get("digital_presence") or {}
    business = assessment.get("business_name") or "Your business"
    goal = _primary_goal_label(assessment)
    website_status = _presence_answer(presence, "website")
    gaps: list[str] = []
    for key in VISIBILITY_KEYS:
        val = _presence_answer(presence, key).lower()
        label = PRESENCE_LABELS.get(key, key.replace("_", " ").title())
        if val in ("no", "not sure", "unsure"):
            gaps.append(f"{label}: {presence.get(key) or 'Not Sure'}")

    wa = website_analysis or {}
    if wa.get("success"):
        for issue in (wa.get("issues_detected") or [])[:4]:
            gaps.append(f"Live site: {issue}")

    return {
        "business_name": business,
        "industry": assessment.get("industry") or "Not specified",
        "country": assessment.get("country") or "Not specified",
        "team_size": assessment.get("business_size") or "Not specified",
        "years_in_business": assessment.get("years_in_business") or "Not specified",
        "primary_goal": goal,
        "website_status": website_status,
        "website_url": assessment.get("website") or assessment.get("website_url") or "",
        "contact_name": assessment.get("full_name") or "",
        "visibility_gaps": gaps[:8],
        "digital_strengths": [
            f"{PRESENCE_LABELS.get(k, k)}: {presence.get(k)}"
            for k in VISIBILITY_KEYS
            if _presence_answer(presence, k).lower() == "yes"
        ][:6],
    }


def _build_visibility_profile(
    assessment: dict[str, Any],
    website_analysis: dict[str, Any] | None,
    overall_score: int,
) -> dict[str, Any]:
    presence = assessment.get("digital_presence") or {}
    business = assessment.get("business_name") or "your business"
    industry = assessment.get("industry") or "your industry"
    country = assessment.get("country") or "your market"
    goal = _primary_goal_label(assessment)

    invisible_reasons: list[dict[str, str]] = []
    for key in VISIBILITY_KEYS:
        val = _presence_answer(presence, key).lower()
        label = PRESENCE_LABELS.get(key, key)
        if val == "no":
            invisible_reasons.append({
                "area": label,
                "severity": "high",
                "detail": f"{business} indicated {label} is No. Customers searching for {industry} services in {country} may not find or trust you through this channel.",
            })
        elif val in ("not sure", "unsure"):
            invisible_reasons.append({
                "area": label,
                "severity": "medium",
                "detail": f"You were unsure about {label}. That uncertainty often means this channel is not working consistently for {business} yet.",
            })

    wa = website_analysis or {}
    if wa.get("success"):
        for issue in (wa.get("issues_detected") or [])[:3]:
            invisible_reasons.append({
                "area": "Website",
                "severity": "high",
                "detail": f"Live website analysis for {business}: {issue}",
            })
        if not wa.get("cta_texts") and not wa.get("conversion_signals", {}).get("has_form"):
            invisible_reasons.append({
                "area": "Conversion paths",
                "severity": "medium",
                "detail": f"Static analysis did not detect clear contact or booking paths on {business}'s site. Visitors may leave without reaching you.",
            })
    elif _presence_answer(presence, "website").lower() == "no":
        invisible_reasons.append({
            "area": "Website",
            "severity": "high",
            "detail": f"{business} does not have a live website. For a {industry} business aiming to {goal.lower()}, that is often the biggest visibility gap.",
        })

    visible_strengths: list[str] = []
    if _presence_answer(presence, "gbp").lower() == "yes":
        visible_strengths.append(f"{business} has Google Business Profile active, which helps local discovery in {country}.")
    if _presence_answer(presence, "social_media").lower() == "yes":
        visible_strengths.append("Active social media gives you channels to stay visible between searches.")
    if _presence_answer(presence, "online_reviews").lower() == "yes":
        visible_strengths.append("Online reviews build trust when prospects compare you to competitors.")
    for sig in (wa.get("strengths_detected") or [])[:3]:
        visible_strengths.append(sig)

    visibility_score = max(15, min(95, overall_score))
    headline = (
        f"{business} has strong visibility foundations, but a few gaps may still hide you from ideal customers."
        if visibility_score >= 70
        else f"Several gaps may be making {business} harder to find online for {goal.lower()}."
        if visibility_score >= 45
        else f"{business} likely has significant visibility gaps. Prospects in {industry} may not see you when they search."
    )

    return {
        "visibility_score": visibility_score,
        "headline": headline,
        "invisible_reasons": invisible_reasons[:6],
        "visible_strengths": visible_strengths[:5],
        "primary_goal_context": f"Your stated priority is {goal}. The gaps below matter most for that outcome.",
    }


def _build_personalized_insights(
    assessment: dict[str, Any],
    website_analysis: dict[str, Any] | None,
    categories: list[dict[str, Any]],
) -> list[str]:
    business = assessment.get("business_name") or "Your business"
    industry = assessment.get("industry") or "your industry"
    country = assessment.get("country") or "your market"
    goal = _primary_goal_label(assessment)
    team = assessment.get("business_size") or "your team size"
    years = assessment.get("years_in_business") or "your timeline"
    presence = assessment.get("digital_presence") or {}
    goals_text = (assessment.get("business_goals") or "").strip()

    insights: list[str] = [
        f"{business} ({industry}, {country}) is focused on {goal.lower()}. Your report weights categories against that goal, not generic SEO advice.",
        f"With {team} and {years} in business, your growth systems should match how you actually sell. Gaps in CRM or follow-up hit harder at your stage.",
    ]

    if goals_text:
        snippet = goals_text[:160] + ("..." if len(goals_text) > 160 else "")
        insights.append(f"You told us: \"{snippet}\". Recommendations below tie back to this context.")

    lowest = sorted(categories, key=lambda c: c.get("score", 0))[:2]
    for cat in lowest:
        insights.append(
            f"{cat.get('label', 'Area')} scored {cat.get('score', 0)}/100 for {business}. "
            f"{(cat.get('finding') or cat.get('explanation') or '')[:180]}"
        )

    wa = website_analysis or {}
    if wa.get("success"):
        title = wa.get("title") or ""
        if title:
            insights.append(
                f"Live analysis of your site found title \"{title[:70]}\". "
                f"{'This supports brand recognition in search.' if len(title) < 60 else 'Consider whether this title clearly states what you offer in ' + country + '.'}"
            )
        issues = wa.get("issues_detected") or []
        if issues:
            insights.append(f"On your live website, we flagged: {issues[0]}. Fixing this is specific to {business}, not a generic template fix.")

    if country.lower() == "jamaica" and _presence_answer(presence, "gbp").lower() != "yes":
        insights.append(
            f"For a Jamaican {industry} business like {business}, Google Business Profile is often the first place locals search. You indicated GBP is {_presence_answer(presence, 'gbp')}."
        )

    return insights[:6]


def _build_live_site_summary(website_analysis: dict[str, Any] | None) -> dict[str, Any] | None:
    wa = website_analysis or {}
    if not wa.get("success"):
        return None
    return {
        "url": wa.get("final_url") or wa.get("requested_url") or "",
        "page_title": wa.get("title") or "",
        "meta_description": wa.get("meta_description") or "",
        "h1_headings": wa.get("h1_headings") or [],
        "cta_texts": wa.get("cta_texts") or [],
        "nav_link_count": len(wa.get("nav_links") or []),
        "issues": wa.get("issues_detected") or [],
        "strengths": wa.get("strengths_detected") or [],
        "is_spa_shell": bool(wa.get("is_spa_shell")),
    }


def _enrich_report(
    report: dict[str, Any],
    assessment: dict[str, Any],
    website_analysis: dict[str, Any] | None,
) -> dict[str, Any]:
    """Ensure business-specific sections exist for UI and PDF."""
    business = assessment.get("business_name") or "your business"
    categories = report.get("categories") or []
    overall = int(report.get("overall_score") or 0)

    if not report.get("business_snapshot"):
        report["business_snapshot"] = _build_business_snapshot(assessment, website_analysis)
    if not report.get("visibility_profile"):
        report["visibility_profile"] = _build_visibility_profile(assessment, website_analysis, overall)
    if not report.get("personalized_insights"):
        report["personalized_insights"] = _build_personalized_insights(assessment, website_analysis, categories)
    if not report.get("live_site_summary") and website_analysis:
        report["live_site_summary"] = _build_live_site_summary(website_analysis)

    if not report.get("business_summary"):
        snap = report["business_snapshot"]
        report["business_summary"] = (
            f"{business} operates in {snap.get('industry')} ({snap.get('country')}). "
            f"Primary goal: {snap.get('primary_goal')}. Team: {snap.get('team_size')}."
        )

    return report


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
            r"<(a|button)[^>]*>([\s\S]*?)</\1>",
            re.I,
        )
        cta_keywords = re.compile(
            r"contact|book|schedule|get started|sign up|buy|shop|quote|free|call|learn more|"
            r"assessment|audit|growth|start|request|demo|consult|quote|hire|work with|"
            r"see what|holding me back|view our|get my",
            re.I,
        )
        ctas: list[str] = []
        for m in cta_patterns.finditer(html):
            text = _strip_tags(m.group(2))[:100].strip()
            if text and cta_keywords.search(text):
                ctas.append(text)
        ctas = list(dict.fromkeys([c for c in ctas if c]))

        # Broader link labels (nav, footer, header) — catches React SSR shells with partial markup
        for m in re.finditer(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>([\s\S]*?)</a>', html, re.I):
            href = (m.group(1) or "").lower()
            label = _strip_tags(m.group(2))[:80].strip()
            if not label or href.startswith(("#", "javascript:")):
                continue
            if cta_keywords.search(label) or any(
                p in href for p in ("/contact", "/book", "/growth", "/audit", "calendly", "mailto:", "tel:")
            ):
                ctas.append(label)
        ctas = list(dict.fromkeys([c for c in ctas if c]))[:12]

        # Class-based CTA hints in static HTML (common in CRA builds)
        has_btn_classes = bool(
            re.search(r'class=["\'][^"\']*\b(btn|button|cta|glow-btn|popup-submit)\b', html, re.I)
        )
        has_growth_route = bool(re.search(r"/growth-preview|/growthiq|/audit", html, re.I))

        body_text = _strip_tags(html)
        word_count = len(body_text.split())
        is_spa_shell = bool(
            re.search(r'<div[^>]+id=["\']root["\']', html, re.I)
            and word_count < 400
        )

        # For JS-heavy sites, scan the main bundle for CTA strings (one lightweight request)
        bundle_ctas: list[str] = []
        if is_spa_shell or (not ctas and status < 400):
            script_srcs = re.findall(
                r'<script[^>]+src=["\']([^"\']+main\.[a-f0-9a-z]+\.js)["\']',
                html,
                re.I,
            )
            for src in script_srcs[:1]:
                bundle_url = urljoin(final_url, src)
                try:
                    bundle_resp = requests.get(
                        bundle_url,
                        timeout=8,
                        headers={"User-Agent": "GrowthIQ-Bot/1.0 (+https://weroi.net)"},
                    )
                    if bundle_resp.status_code < 400:
                        bundle = bundle_resp.text[:600_000]
                        bundle_cta_patterns = [
                            "Get Your Free Audit",
                            "Start Your Free Audit",
                            "See what's making your business invisible",
                            "Free Audit",
                            "Book a call",
                            "View our work",
                            "growth-preview",
                            "book-call",
                            "Contact",
                            "Get started",
                        ]
                        for phrase in bundle_cta_patterns:
                            if phrase.lower() in bundle.lower():
                                bundle_ctas.append(phrase)
                        bundle_ctas = list(dict.fromkeys(bundle_ctas))[:8]
                except requests.RequestException:
                    pass

        all_ctas = list(dict.fromkeys(ctas + bundle_ctas))[:12]

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

        has_form = bool(re.search(r"<form\b", html, re.I))
        has_tel = bool(re.search(r"href=[\"']tel:", html, re.I))
        has_email = bool(re.search(r"href=[\"']mailto:", html, re.I))
        has_h2 = len(re.findall(r"<h2\b", html, re.I))
        load_hint = "light" if len(html) < 80_000 else "heavy" if len(html) > 250_000 else "moderate"

        issues: list[str] = []
        strengths: list[str] = []
        if not title:
            issues.append("Missing page title")
        else:
            strengths.append(f"Page title present: \"{title[:60]}\"")
        if not meta_desc:
            issues.append("Missing meta description")
        else:
            strengths.append("Meta description present")
        if not h1s:
            if not is_spa_shell:
                issues.append("No H1 heading detected in static HTML")
        elif len(h1s) > 1:
            issues.append(f"Multiple H1 headings ({len(h1s)})")
        else:
            strengths.append(f"H1 present: \"{h1s[0][:60]}\"")
        if not has_viewport:
            issues.append("No viewport meta tag (mobile risk)")
        if not https:
            issues.append("Site not served over HTTPS")
        if alt_missing and img_count:
            issues.append(f"{alt_missing} of {img_count} images may lack alt text")
        if not all_ctas and not has_btn_classes and not has_growth_route and not bundle_ctas:
            if is_spa_shell:
                issues.append(
                    "JavaScript app detected; static HTML alone did not reveal CTA text "
                    "(CTAs may still exist after the page loads)"
                )
            else:
                issues.append("No clear call-to-action text detected in static HTML")
        elif all_ctas:
            strengths.append(f"CTA language detected: {', '.join(all_ctas[:3])}")
        if has_growth_route or bundle_ctas:
            strengths.append("Growth or conversion paths detected in site assets")
        if not has_form and not has_tel and not has_email and not is_spa_shell:
            issues.append("No contact form, phone, or email link detected in static HTML")
        elif has_form or has_tel or has_email:
            contact_bits = []
            if has_form:
                contact_bits.append("form")
            if has_tel:
                contact_bits.append("phone link")
            if has_email:
                contact_bits.append("email link")
            strengths.append(f"Contact paths in HTML: {', '.join(contact_bits)}")
        if has_schema:
            strengths.append("Structured data (JSON-LD) detected")
        if has_og:
            strengths.append("Open Graph meta tags present")
        if nav_links:
            strengths.append(f"Navigation with {len(nav_links)} links detected")

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
            "cta_texts": all_ctas,
            "bundle_ctas": bundle_ctas,
            "is_spa_shell": is_spa_shell,
            "strengths_detected": strengths[:10],
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
            "conversion_signals": {
                "has_form": has_form,
                "has_tel_link": has_tel,
                "has_email_link": has_email,
                "cta_count": len(all_ctas),
                "has_button_classes": has_btn_classes,
                "has_growth_route": has_growth_route,
            },
            "content_signals": {
                "h2_count": has_h2,
                "approx_word_count": word_count,
                "page_weight_hint": load_hint,
            },
            "issues_detected": issues[:8],
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

    def cat(
        name: str,
        label: str,
        finding: str,
        recommendation: str,
        weroi_help: str,
        explanation: str = "",
        strengths: list | None = None,
        weaknesses: list | None = None,
        recs: list | None = None,
        priority: str = "Medium",
    ):
        s = scores[name]
        sl = score_label(s)
        return {
            "key": name,
            "label": label,
            "score": s,
            "score_label": sl,
            "finding": _hedged(finding),
            "recommendation": recommendation,
            "weroi_help": weroi_help,
            "explanation": _hedged(explanation or finding),
            "strengths": strengths or [],
            "weaknesses": weaknesses or [],
            "priority_level": priority,
            "recommendations": recs or [recommendation],
        }

    wa = website_analysis or {}
    wa_issues = wa.get("issues_detected") or []
    wa_title = wa.get("title") or ""
    wa_success = wa.get("success")

    categories = []
    website_finding = (
        f"Live analysis found: {', '.join(wa_issues[:3])}."
        if wa_success and wa_issues
        else f"Based on your responses, {business} appears to have a website."
        if has_website
        else f"It appears {business} may not have a live website yet."
    )
    if not has_website:
        categories.append(
            cat(
                "website",
                "Website Experience",
                website_finding,
                "Launch a mobile-responsive site with clear service pages, trust signals, and a simple lead form above the fold.",
                "weROI builds conversion-focused websites tailored to your industry and goals.",
                strengths=["Clear opportunity to build a strong first impression"] if presence.get("website") == "being built" else [],
                weaknesses=["No live website detected", "Potential customers may struggle to verify your business online"],
                recs=[
                    "Launch a mobile-responsive website with clear service pages and contact paths",
                    "Include trust signals: testimonials, location, and a simple lead form",
                ],
                priority="High",
            )
        )
    else:
        site_rec = (
            f"Address detected issues: {wa_issues[0]}."
            if wa_issues
            else "Audit key landing pages for clarity and calls to action."
        )
        categories.append(
            cat(
                "website",
                "Website Experience",
                website_finding + (f' Page title: "{wa_title[:60]}".' if wa_title else ""),
                site_rec,
                "weROI can audit your live site and prioritize fixes that move leads and conversions.",
                strengths=["Website presence established"] + (["HTTPS enabled"] if wa.get("seo_signals", {}).get("https") else []),
                weaknesses=wa_issues[:3] or ["Conversion optimization may need review"],
                recs=["Audit key landing pages for clarity and calls to action", "Ensure mobile performance meets modern standards"],
                priority="High" if wa_issues else "Medium",
            )
        )

    seo_val = presence.get("seo", "no").lower()
    seo_finding = (
        f"You indicated SEO is \"{seo_val}\"."
        + (f" Live site {'lacks' if 'Missing meta description' in wa_issues else 'has'} basic SEO signals checked." if wa_success else "")
        + (
            " It appears discoverability may be limited without active SEO."
            if seo_val in ("no", "not sure")
            else " Some SEO foundation may exist; optimization could unlock additional organic traffic."
        )
    )
    categories.append(
        cat(
            "seo",
            "SEO Potential",
            seo_finding,
            "Claim and optimize Google Business Profile, target 3 to 5 high-intent keywords, and publish content that answers customer questions.",
            "weROI runs focused SEO audits and builds content plans around keywords your customers actually search.",
            strengths=["SEO awareness"] if seo_val == "yes" else [],
            weaknesses=["Limited organic visibility potential"] if seo_val != "yes" else ["Competitive keywords may need targeting"],
            recs=[
                "Claim and optimize Google Business Profile if local",
                "Target 3 to 5 high-intent keywords for your services",
                "Publish helpful content answering customer questions",
            ],
            priority="High" if seo_val != "yes" else "Medium",
        )
    )

    categories.append(
        cat(
            "brand",
            "Brand & Trust",
            f"Brand guidelines status: {presence.get('brand_guidelines', 'not sure')}. Consistent branding typically improves trust and recognition in {industry}.",
            "Document core colors, fonts, and tone of voice, then align website and social profiles to one visual system.",
            "weROI helps businesses tighten brand systems so every touchpoint feels intentional.",
            strengths=["Brand foundation may exist"] if presence.get("brand_guidelines") == "yes" else [],
            weaknesses=["Inconsistent visuals or messaging may reduce trust"] if presence.get("brand_guidelines") != "yes" else [],
            recs=["Document core colors, fonts, and tone of voice", "Align website and social profiles to one visual system"],
            priority="Medium",
        )
    )

    categories.append(
        cat(
            "performance",
            "Performance",
            f"Performance optimization: {presence.get('performance_optimization', 'not sure')}."
            + (f" Live page weight appears {wa.get('content_signals', {}).get('page_weight_hint', 'unknown')}." if wa_success else ""),
            "Compress images, enable caching, and test Core Web Vitals on mobile.",
            "weROI optimizes site speed and mobile experience as part of every build and audit.",
            strengths=[] if presence.get("performance_optimization") != "yes" else ["Performance awareness noted"],
            weaknesses=["Slow load times may increase bounce rates"] if presence.get("performance_optimization") != "yes" else [],
            recs=["Compress images and enable caching", "Test Core Web Vitals on mobile"],
            priority="Medium",
        )
    )

    categories.append(
        cat(
            "lead_gen",
            "Lead Generation",
            f"CRM: {presence.get('crm', 'no')}, email marketing: {presence.get('email_marketing', 'no')}."
            + (f" Primary goal noted: {assessment.get('primary_goal', 'growth')}." if assessment.get("primary_goal") else ""),
            "Add a lead form on every key page and set up automated follow-up within 24 hours.",
            "weROI designs lead capture and follow-up systems that match how your team actually sells.",
            strengths=["Lead capture systems may be partially in place"] if presence.get("crm") == "yes" else [],
            weaknesses=["Leads may be lost without structured follow-up"] if presence.get("crm") != "yes" else [],
            recs=["Add a simple lead form on every key page", "Set up automated follow-up within 24 hours"],
            priority="High" if presence.get("crm") != "yes" else "Low",
        )
    )

    categories.append(
        cat(
            "ux",
            "User Experience",
            "Navigation clarity and mobile usability are important growth levers for your visitors."
            + (f" Detected {len(wa.get('nav_links') or [])} nav items on your live site." if wa_success else ""),
            "Simplify navigation to 5 or fewer primary items and make phone, email, and booking one tap away on mobile.",
            "weROI maps user journeys and removes friction from contact and booking flows.",
            strengths=["Opportunity to refine user journeys"],
            weaknesses=["Friction in booking or contact flows may reduce conversions"],
            recs=["Simplify navigation to 5 or fewer primary items", "Make phone, email, and booking one tap away on mobile"],
            priority="Medium",
        )
    )

    categories.append(
        cat(
            "accessibility",
            "Accessibility",
            f"Accessibility status: {presence.get('accessibility', 'not sure')}."
            + (f" {wa.get('accessibility_signals', {}).get('images_missing_alt', 0)} images may lack alt text on your site." if wa_success and wa.get("accessibility_signals") else ""),
            "Add alt text to images and ensure sufficient color contrast and keyboard navigation.",
            "weROI builds accessible sites that expand reach and reduce compliance risk.",
            strengths=[] if presence.get("accessibility") != "yes" else ["Accessibility considered"],
            weaknesses=["Potential barriers for some users"] if presence.get("accessibility") != "yes" else [],
            recs=["Add alt text to images", "Ensure sufficient color contrast and keyboard navigation"],
            priority="Low" if presence.get("accessibility") == "yes" else "Medium",
        )
    )

    categories.append(
        cat(
            "trust",
            "Trust & Credibility",
            f"Reviews: {presence.get('online_reviews', 'no')}, SSL: {presence.get('ssl', 'not sure')}."
            + (f" Trust signals on site: {', '.join(wa.get('trust_signals') or [])[:120]}." if wa_success and wa.get("trust_signals") else ""),
            "Collect and display recent client reviews and ensure HTTPS across all pages.",
            "weROI helps businesses surface social proof where it influences buying decisions.",
            strengths=["Trust signals may exist"] if presence.get("online_reviews") == "yes" else [],
            weaknesses=["Social proof may be underutilized"] if presence.get("online_reviews") != "yes" else [],
            recs=["Collect and display recent client reviews", "Ensure HTTPS across all pages"],
            priority="Medium",
        )
    )

    categories.append(
        cat(
            "marketing",
            "Marketing Channels",
            f"Social: {presence.get('social_media', 'no')}, paid ads: {presence.get('paid_ads', 'no')}, blog: {presence.get('blog', 'no')}.",
            "Choose 1 to 2 primary channels and post consistently; repurpose website content into short-form posts.",
            "weROI plans channel strategy around where your ideal customers actually spend time.",
            strengths=["Active marketing channels noted"] if presence.get("social_media") == "yes" else [],
            weaknesses=["Channel mix may be underdeveloped"] if presence.get("social_media") != "yes" else [],
            recs=["Choose 1 to 2 primary channels and post consistently", "Repurpose website content into short-form posts"],
            priority="Medium",
        )
    )

    categories.append(
        cat(
            "automation",
            "Automation Readiness",
            f"Automation status: {presence.get('automation', 'not sure')}.",
            "Automate appointment reminders and lead routing; connect forms to CRM or email sequences.",
            "weROI connects the tools you already use into workflows that save hours each week.",
            strengths=["Some automation may exist"] if presence.get("automation") == "yes" else [],
            weaknesses=["Manual workflows may limit scale"] if presence.get("automation") != "yes" else [],
            recs=["Automate appointment reminders and lead routing", "Connect forms to CRM or email sequences"],
            priority="Medium" if presence.get("automation") != "yes" else "Low",
        )
    )

    categories.append(
        cat(
            "digital_presence",
            "Digital Presence",
            f"Overall digital footprint for {business} in {industry} shows room to strengthen how customers discover and evaluate you online.",
            "Prioritize website, SEO, and lead capture in the next 90 days.",
            "weROI builds integrated digital presence strategies, not isolated fixes.",
            strengths=["Clear growth path identified"],
            weaknesses=["Gaps across multiple digital touchpoints"],
            recs=["Prioritize website, SEO, and lead capture in the next 90 days"],
            priority="High",
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
        "report_summary": _build_report_summary(business, overall, categories),
        "whats_included": _whats_included_summary(),
    }
    return _enrich_report(report, assessment, website_analysis)


def _build_report_summary(business: str, overall: int, categories: list[dict[str, Any]]) -> dict[str, Any]:
    """Plain-language summary with soft-sell tone based on score band."""
    sorted_cats = sorted(categories, key=lambda c: c.get("score", 0))
    priority_areas = [
        f"{c.get('label', c.get('key', 'Area'))} ({c.get('score', 0)} · {c.get('score_label', score_label(c.get('score', 0)))})"
        for c in sorted_cats[:3]
    ]

    if overall >= 85:
        overall_meaning = (
            f"{business} is in a strong position with a score of {overall}/100 ({score_label(overall)}). "
            "The focus now is next-level optimization, not fixing fundamentals. "
            "Fine-tuning conversion paths and scaling what already works can unlock further growth."
        )
        expert_invite = (
            "If you want a second set of eyes on advanced opportunities, our team offers complimentary expert reviews. "
            "No pressure. Many strong scorers use it to validate their roadmap."
        )
    elif overall >= 60:
        overall_meaning = (
            f"With a score of {overall}/100 ({score_label(overall)}), {business} has a solid foundation "
            "with clear gaps worth addressing. The categories below highlight where focused effort "
            "could have the most impact on leads and visibility."
        )
        expert_invite = (
            "A complimentary expert review from weROI can help prioritize these gaps and map a practical next step. "
            "Request one if you would like our team to go deeper."
        )
    else:
        overall_meaning = (
            f"At {overall}/100 ({score_label(overall)}), {business} has meaningful room to grow online. "
            "This is not a crisis, but several areas need attention to stop losing potential customers. "
            "The good news: the biggest wins are often straightforward fixes."
        )
        expert_invite = (
            "Our complimentary expert review is designed for situations like this. "
            "The weROI team can validate these findings and help you tackle the highest-impact items first."
        )

    return {
        "overall_meaning": overall_meaning,
        "priority_areas": priority_areas,
        "expert_review_invite": expert_invite,
    }


def _normalize_category(cat_data: dict[str, Any]) -> dict[str, Any]:
    """Ensure every category has required dynamic fields."""
    s = int(cat_data.get("score") or 0)
    key = cat_data.get("key") or ""
    label = cat_data.get("label") or CATEGORY_DISPLAY.get(key, key.replace("_", " ").title())
    finding = cat_data.get("finding") or cat_data.get("explanation") or ""
    recommendation = cat_data.get("recommendation") or (
        (cat_data.get("recommendations") or [""])[0]
    )
    weroi_help = cat_data.get("weroi_help") or (
        f"weROI can help strengthen {label.lower()} with a focused plan tailored to your business."
    )
    return {
        **cat_data,
        "key": key,
        "label": label,
        "score": s,
        "score_label": cat_data.get("score_label") or score_label(s),
        "finding": finding,
        "recommendation": recommendation,
        "weroi_help": weroi_help,
        "explanation": cat_data.get("explanation") or finding,
        "recommendations": cat_data.get("recommendations") or ([recommendation] if recommendation else []),
        "strengths": cat_data.get("strengths") or [],
        "weaknesses": cat_data.get("weaknesses") or [],
        "priority_level": cat_data.get("priority_level") or ("High" if s < 60 else "Medium" if s < 85 else "Low"),
    }


def _normalize_report(report: dict[str, Any], assessment: dict[str, Any], website_analysis: dict[str, Any] | None) -> dict[str, Any]:
    """Post-process AI output to ensure schema completeness."""
    business = assessment.get("business_name") or "your business"
    categories = [_normalize_category(c) for c in (report.get("categories") or [])]
    report["categories"] = categories

    overall = int(report.get("overall_score") or 0)
    if not report.get("report_summary"):
        report["report_summary"] = _build_report_summary(business, overall, categories)
    if "confidence_score" not in report:
        report["confidence_score"] = _confidence_from_assessment(assessment, website_analysis)
    if website_analysis:
        report["website_analysis_used"] = bool(website_analysis.get("success"))
    return _enrich_report(report, assessment, website_analysis)


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
- Reference the user's ACTUAL answers by name (e.g. "You indicated SEO is No", "Primary goal: Get more leads")
- Use the business name at least once in executive_summary and twice across personalized_insights
- Tie recommendations to their primary_goal, industry, country, business_size, and business_goals text when provided
- visibility_profile: explain what may make THIS business invisible online (not generic). invisible_reasons must cite their answers or live site signals
- personalized_insights: 5-6 bullets, each must reference business name, industry, goal, or a specific answer. No generic tips
- business_snapshot: structured facts from their submission
- If website_analysis is provided, cite ONLY verified signals (title, meta, h1, nav, CTAs, issues_detected, strengths_detected, bundle_ctas, is_spa_shell, conversion_signals, seo_signals). Say "live website analysis" when citing these. NEVER invent website data. If strengths_detected lists CTAs or contact paths, do NOT claim CTAs are missing. For is_spa_shell sites, note that static analysis is limited and avoid false negatives.
- Every category MUST have specific finding text referencing real answers or verified site signals. NO generic advice like "your SEO could be better".
- Scores 0-100 per category; overall_score is weighted average
- score_label per category: "Strong" (85+), "Needs Attention" (60-84), "Priority Area" (below 60)
- Scoring tone: 85+ congratulate and suggest next-level optimizations; 60-84 state factual gaps as natural next steps; below 60 be direct but not alarmist
- priority_level: High, Medium, or Low
- growth_level: Emerging (0-39), Growing (40-59), Established (60-79), Leading (80-100)
- letter_grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- confidence_score: 0-100 reflecting how much reliable data was available
- business_summary: 2-3 sentence overview referencing industry, goals, and website if analyzed
- weroi_help: one soft sentence per category on how weROI could help (not a hard sell)
- report_summary: overall_meaning in plain language, priority_areas (top 2-3 lowest-scoring categories with scores), expert_review_invite (natural invite; high scorers should NOT feel pushed to a sales call)
- Never use em dashes or en dashes in any user-facing text. Use periods, commas, or colons instead.

Category labels to use:
website=Website Experience, seo=SEO Potential, brand=Brand & Trust, performance=Performance,
lead_gen=Lead Generation, ux=User Experience, accessibility=Accessibility, trust=Trust & Credibility,
marketing=Marketing Channels, automation=Automation Readiness, digital_presence=Digital Presence

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
  "business_snapshot": {
    "business_name": string,
    "industry": string,
    "country": string,
    "team_size": string,
    "years_in_business": string,
    "primary_goal": string,
    "website_status": string,
    "website_url": string,
    "visibility_gaps": [string],
    "digital_strengths": [string]
  },
  "visibility_profile": {
    "visibility_score": number,
    "headline": string,
    "primary_goal_context": string,
    "invisible_reasons": [{"area": string, "severity": string, "detail": string}],
    "visible_strengths": [string]
  },
  "personalized_insights": [string],
  "live_site_summary": {
    "url": string,
    "page_title": string,
    "meta_description": string,
    "h1_headings": [string],
    "cta_texts": [string],
    "nav_link_count": number,
    "issues": [string],
    "strengths": [string],
    "is_spa_shell": boolean
  },
  "report_summary": {
    "overall_meaning": string,
    "priority_areas": [string],
    "expert_review_invite": string
  },
  "categories": [{
    "key": string,
    "label": string,
    "score": number,
    "score_label": string,
    "finding": string,
    "recommendation": string,
    "weroi_help": string,
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
        report = _normalize_report(report, assessment, website_analysis)
        report["whats_included"] = _whats_included_summary()
        report["generation_mode"] = provider
        return report
    except Exception as exc:
        logger.error("%s GrowthIQ generation failed: %s", provider, exc)
        report = _build_fallback_report(assessment, website_analysis)
        report["generation_mode"] = f"fallback_{provider}_error"
        return report


CHAT_SYSTEM = """You are the weROI GrowthIQ™ assistant on weroi.net.
Answer in 2 to 4 short sentences. Be helpful, warm, and professional, not salesy.
Topics: GrowthIQ free assessment, what the report includes, expert review (optional, may include strategic ideas or visual concepts at weROI's discretion, not guaranteed), weROI services (websites, SEO, funnels, automation, Jamaica).
When someone wants their score or report, suggest they start the free assessment at /growth-preview.
Never guarantee rankings, revenue, or specific outcomes. Never invent pricing."""


def _fallback_chat_answer(message: str) -> str:
    lower = message.lower()
    if any(w in lower for w in ("free", "cost", "price", "pay")):
        return "GrowthIQ™ is completely free with no obligation. You get an instant AI report; an expert review is optional afterward."
    if any(w in lower for w in ("long", "time", "minute")):
        return "The assessment takes about 3 to 5 minutes. Your progress saves automatically if you leave and come back."
    if any(w in lower for w in ("expert", "review", "mockup", "mock")):
        return "After your free report, you can request a complimentary expert review. Our team may share deeper strategy and, when appropriate, visual concepts to show what working with weROI could look like. This is at our discretion and not guaranteed."
    if any(w in lower for w in ("service", "weroi", "agency", "do you")):
        return "weROI is a digital growth partner in Jamaica. We build websites, SEO, marketing systems, automation, and custom software focused on measurable growth."
    if any(w in lower for w in ("score", "assessment", "growthiq", "start", "report")):
        return "Start your free GrowthIQ™ assessment to get your personalized growth score, opportunities, and roadmap in minutes."
    return "I can help with GrowthIQ™, the free assessment, expert reviews, and weROI services. What would you like to know?"


async def answer_growthiq_chat(message: str) -> str:
    text = (message or "").strip()[:500]
    if not text:
        return "Ask me anything about GrowthIQ or weROI."

    resolved = _resolve_ai_provider()
    if not resolved:
        return _fallback_chat_answer(text)

    provider, api_key, model = resolved
    try:
        from openai import AsyncOpenAI

        client_kwargs: dict[str, Any] = {"api_key": api_key}
        if provider == "groq":
            client_kwargs["base_url"] = "https://api.groq.com/openai/v1"
        client = AsyncOpenAI(**client_kwargs)
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": CHAT_SYSTEM},
                {"role": "user", "content": text},
            ],
            temperature=0.5,
            max_tokens=150,
        )
        reply = (response.choices[0].message.content or "").strip()
        return reply or _fallback_chat_answer(text)
    except Exception as exc:
        logger.warning("GrowthIQ chat failed: %s", exc)
        return _fallback_chat_answer(text)
