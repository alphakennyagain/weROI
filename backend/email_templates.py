"""
weROI branded transactional email templates for Resend.

All templates return {"subject": str, "html": str, "text": str}.
"""

from __future__ import annotations

from html import escape
from typing import Any

from visibility_checklist_content import (
    VISIBILITY_CHECKLIST_CLOSING,
    VISIBILITY_CHECKLIST_INTRO,
    VISIBILITY_CHECKLIST_ITEMS,
    VISIBILITY_CHECKLIST_TITLE,
)

# Brand
BRAND_LIME = "#c8f542"
BRAND_DARK = "#111113"
BRAND_MUTED = "#666666"
LOGO_URL = "https://weroi.net/logo192.png"
SITE_URL = "https://weroi.net"
CALENDLY_URL = "https://calendly.com/contact-weroi/30min"
UNSUBSCRIBE_URL = f"{SITE_URL}/unsubscribe"

GROWTH_GUIDE_PDF = (
    "https://customer-assets.emergentagent.com/job_premium-scale-3/"
    "artifacts/xl4qmsi8_WEROI%20GROWTH%20GUIDE.pdf"
)
ANTI_DIY_PDF = (
    "https://customer-assets.emergentagent.com/job_premium-scale-3/"
    "artifacts/g2op5jfz_WEROI%20ANTI%20DIY%20FRAMEWORK.pdf"
)
VISIBILITY_CHECKLIST_PDF_URL = f"{SITE_URL}/downloads/weROI-Visibility-Checklist.pdf"
AUDIT_URL = f"{SITE_URL}/audit"


def _e(value: Any) -> str:
    return escape(str(value or ""), quote=True)


def _cta_button(text: str, link: str) -> str:
    if not text or not link:
        return ""
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
      <tr>
        <td align="center">
          <a href="{_e(link)}" style="display: inline-block; background-color: {BRAND_DARK}; color: {BRAND_LIME}; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px;">
            {_e(text)}
          </a>
        </td>
      </tr>
    </table>
    """


def _section_box(title: str, body_html: str, dark: bool = False) -> str:
    if dark:
        return f"""
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
          <tr>
            <td style="padding: 24px; background-color: {BRAND_DARK}; color: #ffffff;">
              <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: {BRAND_LIME};">{_e(title)}</p>
              <div style="font-size: 16px; font-weight: 300; line-height: 1.7;">{body_html}</div>
            </td>
          </tr>
        </table>
        """
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td style="padding: 24px; background-color: #fafafa; border-left: 3px solid {BRAND_LIME};">
          <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999999;">{_e(title)}</p>
          <div style="font-size: 16px; font-weight: 300; line-height: 1.7; color: #444444;">{body_html}</div>
        </td>
      </tr>
    </table>
    """


def get_premium_email_template(
    content: str,
    headline: str = "",
    cta_text: str = "",
    cta_link: str = "",
    preheader: str = "",
) -> str:
    headline_html = (
        f'<h1 style="color: {BRAND_DARK}; font-size: 28px; margin: 0 0 24px 0; font-weight: 600; line-height: 1.3; letter-spacing: -0.5px;">{_e(headline)}</h1>'
        if headline
        else ""
    )
    preheader_html = (
        f'<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">{_e(preheader)}</div>'
        if preheader
        else ""
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>weROI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  {preheader_html}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #e8e8e8; border-radius: 4px;">
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid #f0f0f0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="{LOGO_URL}" alt="weROI" width="40" height="40" style="display: inline-block; vertical-align: middle; border-radius: 8px;" />
                    <span style="display: inline-block; vertical-align: middle; margin-left: 12px; font-size: 22px; font-weight: 300; letter-spacing: 1px;">
                      <span style="color: #888888;">we</span><span style="color: {BRAND_DARK}; font-weight: 700;">ROI</span>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              {headline_html}
              <div style="color: #444444; font-size: 16px; line-height: 1.8; font-weight: 400;">
                {content}
              </div>
              {_cta_button(cta_text, cta_link)}
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 40px; border-top: 1px solid #f0f0f0; text-align: center;">
              <p style="color: #999999; font-size: 12px; margin: 0; letter-spacing: 1px; text-transform: uppercase;">
                Engineered for Growth
              </p>
              <p style="color: #bbbbbb; font-size: 11px; margin: 12px 0 0 0; line-height: 1.6;">
                weROI &middot; <a href="{SITE_URL}" style="color: #999999;">weroi.net</a><br>
                &copy; 2025 weROI. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def _infer_business_type(business_description: str | None, services: list[str]) -> str:
    if business_description and business_description.strip():
        desc = business_description.strip()
        return desc[:120] + ("..." if len(desc) > 120 else "")
    if services:
        return f"a business focused on {', '.join(services[:3]).lower()}"
    return "your business"


def get_audit_confirmation_email(name: str, company_name: str, calendly_url: str = CALENDLY_URL) -> dict:
    content = f"""
    <p style="margin: 0 0 20px 0;">Hi {_e(name)},</p>
    <p style="margin: 0 0 20px 0;">Thanks for reaching out to weROI. Your free growth audit request for <strong style="color: {BRAND_DARK};">{_e(company_name)}</strong> is in our queue.</p>
    {_section_box(
        "What happens next",
        "1. Our team reviews your business and goals<br>"
        "2. We identify growth gaps and quick wins<br>"
        "3. You receive your personalized growth snapshot within 48 hours"
    )}
    <p style="margin: 0 0 20px 0;">Want to move faster? Book a short discovery call and we can walk through your audit together.</p>
    {_section_box(
        "Your audit will cover",
        f"Your website, funnel, and marketing setup<br>"
        f"Where leads or sales may be slipping<br>"
        f"Practical next steps for {_e(company_name)}",
        dark=True,
    )}
    <p style="margin: 0;">Talk soon,<br><strong style="color: {BRAND_DARK};">The weROI Team</strong></p>
    """
    text = f"""Hi {name},

Thanks for reaching out to weROI. Your free growth audit request for {company_name} is in our queue.

What happens next:
1. Our team reviews your business and goals
2. We identify growth gaps and quick wins
3. You receive your personalized growth snapshot within 48 hours

Want to move faster? Book a discovery call: {calendly_url}

Talk soon,
The weROI Team
"""
    return {
        "subject": f"We received your growth audit request, {name}",
        "html": get_premium_email_template(
            content,
            headline="We received your request",
            cta_text="Book a Discovery Call",
            cta_link=calendly_url,
            preheader=f"Your audit for {company_name} is in our queue. Expect your snapshot within 48 hours.",
        ),
        "text": text,
    }


def get_growth_audit_email(
    name: str,
    company_name: str,
    business_description: str | None = None,
    services_interested: list[str] | None = None,
    timeline: str | None = None,
    calendly_url: str = CALENDLY_URL,
) -> dict:
    services = services_interested or []
    services_display = ", ".join(services) if services else "growth and marketing"
    business_type = _infer_business_type(business_description, services)
    timeline_display = timeline or "your current timeline"

    roadmap_sections = [
        (
            "Website & First Impressions",
            "Your site is often the first handshake. We look at speed, mobile experience, messaging clarity, and trust signals — the basics that turn visitors into leads.",
        ),
        (
            "SEO & Visibility",
            "Being findable matters. We review search presence, local visibility, and content gaps so the right people can discover you before competitors do.",
        ),
        (
            "Lead Generation & Funnels",
            "Traffic without a path to conversion is wasted spend. We map how prospects enter, where they drop off, and what offers or pages could capture more demand.",
        ),
        (
            "Conversion & Follow-up",
            "Most revenue is lost after the first touch. We assess forms, calls-to-action, response time, and follow-up sequences that turn interest into booked calls.",
        ),
        (
            "Systems & Automation",
            "Scaling breaks when everything is manual. We flag CRM gaps, repetitive tasks, and automation opportunities that free your team to sell and deliver.",
        ),
    ]

    roadmap_html = ""
    roadmap_text_parts = []
    for i, (title, desc) in enumerate(roadmap_sections, 1):
        roadmap_html += f"""
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #eeeeee;">
            <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: {BRAND_DARK};">
              <span style="color: {BRAND_LIME}; background: {BRAND_DARK}; padding: 2px 8px; border-radius: 4px; margin-right: 8px; font-size: 12px;">0{i}</span>
              {_e(title)}
            </p>
            <p style="margin: 0; font-size: 15px; line-height: 1.7; color: {BRAND_MUTED};">{_e(desc)}</p>
          </td>
        </tr>
        """
        roadmap_text_parts.append(f"{i}. {title}\n   {desc}")

    content = f"""
    <p style="margin: 0 0 20px 0;">Hi {_e(name)},</p>
    <p style="margin: 0 0 20px 0;">
      Here is your growth snapshot for <strong style="color: {BRAND_DARK};">{_e(company_name)}</strong>.
      Based on what you shared — {_e(business_type)} — these are the priority areas we typically address for businesses like yours.
    </p>
    {_section_box(
        "Your focus areas",
        f"<strong>Services:</strong> {_e(services_display)}<br>"
        f"<strong>Timeline:</strong> {_e(timeline_display)}",
    )}
    <p style="margin: 0 0 12px 0; font-weight: 600; color: {BRAND_DARK};">Your growth roadmap</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0;">
      {roadmap_html}
    </table>
    <p style="margin: 0 0 20px 0;">
      This is a starting framework — your full audit will go deeper into {_e(company_name)} specifically.
      Our team will follow up within 48 hours with tailored recommendations.
    </p>
    <p style="margin: 0;">To growth,<br><strong style="color: {BRAND_DARK};">The weROI Team</strong></p>
    """

    text = f"""Hi {name},

Here is your growth snapshot for {company_name}.
Based on what you shared — {business_type} — these are the priority areas we typically address.

Your focus areas:
- Services: {services_display}
- Timeline: {timeline_display}

Your growth roadmap:
{chr(10).join(roadmap_text_parts)}

This is a starting framework. Our team will follow up within 48 hours with tailored recommendations.

Book a call: {calendly_url}

To growth,
The weROI Team
"""
    return {
        "subject": f"Your growth snapshot for {company_name}",
        "html": get_premium_email_template(
            content,
            headline="Your Growth Roadmap",
            cta_text="Book Your Strategy Call",
            cta_link=calendly_url,
            preheader=f"A personalized growth framework for {company_name}.",
        ),
        "text": text,
    }


def get_audit_owner_notification_email(lead: Any) -> dict:
    services = ", ".join(lead.services_interested) if lead.services_interested else "Not specified"
    content = f"""
    <p style="margin: 0 0 20px 0;">A new project inquiry just came in from the audit form.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 20px 0; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Name</td></tr>
      <tr><td style="padding: 0 0 16px 0; color: {BRAND_DARK}; font-size: 16px;">{_e(lead.name)}</td></tr>
      <tr><td style="padding: 8px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td></tr>
      <tr><td style="padding: 0 0 16px 0; color: {BRAND_DARK}; font-size: 16px;"><a href="mailto:{_e(lead.email)}" style="color: {BRAND_DARK};">{_e(lead.email)}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</td></tr>
      <tr><td style="padding: 0 0 16px 0; color: {BRAND_DARK}; font-size: 16px;">{_e(lead.phone)}</td></tr>
      <tr><td style="padding: 8px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Business</td></tr>
      <tr><td style="padding: 0 0 16px 0; color: {BRAND_DARK}; font-size: 16px;">{_e(lead.company_name)}</td></tr>
      <tr><td style="padding: 8px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Website</td></tr>
      <tr><td style="padding: 0 0 16px 0; color: {BRAND_DARK}; font-size: 16px;">{_e(lead.website or "Not provided")}</td></tr>
      <tr><td style="padding: 8px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">How they found us</td></tr>
      <tr><td style="padding: 0 0 16px 0; color: {BRAND_DARK}; font-size: 16px;">{_e(lead.how_found_us)}</td></tr>
      <tr><td style="padding: 8px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Services</td></tr>
      <tr><td style="padding: 0 0 16px 0; color: {BRAND_DARK}; font-size: 16px;">{_e(services)}</td></tr>
      <tr><td style="padding: 8px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Timeline</td></tr>
      <tr><td style="padding: 0 0 16px 0; color: {BRAND_DARK}; font-size: 16px;">{_e(lead.timeline or "Not specified")}</td></tr>
    </table>
    <p style="margin: 0 0 12px 0; font-weight: 600; color: {BRAND_DARK};">About the business</p>
    <p style="margin: 0 0 20px 0; color: #444444; line-height: 1.7;">{_e(lead.business_description or "Not provided")}</p>
    <p style="margin: 0 0 12px 0; font-weight: 600; color: {BRAND_DARK};">Additional details</p>
    <p style="margin: 0; color: #444444; line-height: 1.7;">{_e(lead.additional_details or "None")}</p>
    """
    text = f"""New audit lead

Name: {lead.name}
Email: {lead.email}
Phone: {lead.phone}
Business: {lead.company_name}
Website: {lead.website or "Not provided"}
How they found us: {lead.how_found_us}
Services: {services}
Timeline: {lead.timeline or "Not specified"}

About the business:
{lead.business_description or "Not provided"}

Additional details:
{lead.additional_details or "None"}
"""
    return {
        "subject": f"New audit lead: {lead.name} ({lead.company_name})",
        "html": get_premium_email_template(content, headline="New Project Inquiry"),
        "text": text,
    }


def _greeting(name: str | None) -> str:
    if name and str(name).strip():
        return f"Hi {_e(str(name).strip())},"
    return "Hi there,"


def get_email_1_content(name: str) -> dict:
    display_name = str(name).strip() if name and str(name).strip() else "there"
    greeting = _greeting(name)
    content = f"""
    <p style="margin: 0 0 20px 0;">{greeting}</p>
    <p style="margin: 0 0 20px 0;">You made a smart move.</p>
    <p style="margin: 0 0 20px 0;">Most businesses stay small because they lack the systems to scale. You just took the first step to changing that.</p>
    <p style="margin: 0 0 8px 0; color: {BRAND_DARK}; font-weight: 500;">Your blueprint is ready.</p>
    <p style="margin: 0 0 20px 0;">Inside, pay close attention to <strong style="color: {BRAND_DARK};">Step 3: The Trust Architecture</strong>. It is the missing link for most of our clients.</p>
    {_section_box("weROI Insight", '<em>"Structure beats strategy. Systems beat talent."</em>')}
    <p style="margin: 0;">Talk soon,<br><strong style="color: {BRAND_DARK};">The weROI Team</strong></p>
    """
    text = f"""{greeting}

You made a smart move. Your scaling blueprint is ready.

Download your guide: {GROWTH_GUIDE_PDF}

Pay close attention to Step 3: The Trust Architecture.

Talk soon,
The weROI Team
"""
    return {
        "subject": "Your growth guide from weROI",
        "html": get_premium_email_template(
            content,
            headline="Your Growth Guide",
            cta_text="Download Your Growth Guide",
            cta_link=GROWTH_GUIDE_PDF,
            preheader="Your growth guide is ready to download.",
        ),
        "text": text,
    }


def get_email_2_content(name: str, framework_pdf_url: str = ANTI_DIY_PDF) -> dict:
    content = f"""
    <p style="margin: 0 0 20px 0;">{_e(name)},</p>
    <p style="margin: 0 0 20px 0;">Quick question: did you get to the <strong style="color: {BRAND_DARK};">'Online Trust'</strong> section in the guide?</p>
    <p style="margin: 0 0 20px 0;">Most founders try to automate growth before they have fixed their credibility. It is like pouring water into a bucket with holes.</p>
    <p style="margin: 0 0 20px 0;">We have found that even a <strong style="color: {BRAND_DARK};">10% increase in trust metrics</strong> can double your conversion rate.</p>
    {_section_box(
        "The weROI Insight",
        "Trust leaks cost businesses 40-60% of potential revenue. Most do not even know where to look.",
        dark=True,
    )}
    <p style="margin: 0 0 20px 0;">That is why we created the <strong style="color: {BRAND_DARK};">Anti-DIY Framework</strong> — a blueprint for founders who are done guessing and ready to build systems that actually scale.</p>
    <p style="margin: 0;">Download it below. It is the exact framework we use with our clients.</p>
    """
    text = f"""{name},

Did you get to the Online Trust section in the guide?

Download the Anti-DIY Framework: {framework_pdf_url}

The weROI Team
"""
    return {
        "subject": "The trust gap most founders miss",
        "html": get_premium_email_template(
            content,
            headline="The Hidden Cost of Trust Leaks",
            cta_text="Download The Anti-DIY Framework",
            cta_link=framework_pdf_url,
            preheader="The trust gap that quietly costs you revenue.",
        ),
        "text": text,
    }


def get_email_3_content(name: str, company_name: str, audit_url: str = AUDIT_URL) -> dict:
    company_display = company_name if company_name else "your business"
    content = f"""
    <p style="margin: 0 0 20px 0;">By now, you have seen the blueprint.</p>
    <p style="margin: 0 0 20px 0;">But here is the truth: <strong style="color: {BRAND_DARK};">a map is useless without an engine.</strong></p>
    {_section_box(
        "Free growth audit",
        "We review your website, funnel, and marketing setup — then share practical next steps for your business.",
    )}
    <p style="margin: 0 0 20px 0;">We will dive into <strong style="color: {BRAND_DARK};">{_e(company_display)}</strong>'s specific bottlenecks and hand you a ready-to-implement roadmap.</p>
    <p style="margin: 0 0 8px 0; font-weight: 500; color: {BRAND_DARK};">What you will receive:</p>
    <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #444444;">
      <li style="margin-bottom: 8px;">Complete trust and conversion audit</li>
      <li style="margin-bottom: 8px;">Top 5 revenue leaks identified</li>
      <li style="margin-bottom: 8px;">Custom implementation roadmap</li>
      <li style="margin-bottom: 8px;">ROI projection model</li>
    </ul>
    <p style="margin: 0; font-weight: 500; color: {BRAND_DARK};">No fluff. Just ROI.</p>
    """
    text = f"""A custom roadmap for {company_display}?

Claim your free audit: {audit_url}

The weROI Team
"""
    return {
        "subject": f"A custom roadmap for {company_display}?",
        "html": get_premium_email_template(
            content,
            headline="Ready for Your Custom Roadmap?",
            cta_text="Claim Your Free Audit",
            cta_link=audit_url,
            preheader=f"Your personalized growth audit for {company_display}.",
        ),
        "text": text,
    }


def get_growthiq_meeting_email(
    name: str,
    business_name: str,
    calendly_url: str = CALENDLY_URL,
    proposed_times: str | None = None,
    personal_message: str | None = None,
    overall_score: int | None = None,
    letter_grade: str | None = None,
) -> dict:
    """Email with booking link after admin sends meeting request from dashboard."""
    greeting = _greeting(name)
    score_line = ""
    if overall_score is not None:
        grade_part = f" ({letter_grade})" if letter_grade else ""
        score_line = (
            f'<p style="margin: 0 0 20px 0;">Your GrowthIQ™ score: '
            f'<strong style="color: {BRAND_DARK};">{overall_score}{_e(grade_part)}</strong></p>'
        )

    personal_block = ""
    if personal_message and personal_message.strip():
        personal_block = _section_box(
            "A note from our team",
            _e(personal_message.strip()).replace("\n", "<br>"),
        )

    times_block = ""
    if proposed_times and proposed_times.strip():
        times_block = _section_box(
            "Suggested times",
            f'<p style="margin: 0; white-space: pre-line;">{_e(proposed_times.strip())}</p>',
            dark=True,
        )

    content = f"""
    <p style="margin: 0 0 20px 0;">{greeting}</p>
    <p style="margin: 0 0 20px 0;">Thanks for requesting your complimentary expert review from weROI. We have reviewed your GrowthIQ™ assessment for <strong style="color: {BRAND_DARK};">{_e(business_name)}</strong> and would love to walk through the findings with you.</p>
    {score_line}
    {personal_block}
    {times_block}
    {_section_box(
        "Book your call",
        "Pick a time that works for you. This is a short, no-pressure conversation to review your report and answer questions.",
    )}
    <p style="margin: 0 0 20px 0;">If none of the listed times work, reply to this email and we will find another slot.</p>
    <p style="margin: 0;">Talk soon,<br><strong style="color: {BRAND_DARK};">The weROI Team</strong></p>
    """
    times_text = f"\n\nSuggested times:\n{proposed_times.strip()}\n" if proposed_times and proposed_times.strip() else ""
    note_text = f"\n\n{personal_message.strip()}\n" if personal_message and personal_message.strip() else ""
    score_text = f"\nYour GrowthIQ score: {overall_score}{f' ({letter_grade})' if letter_grade else ''}\n" if overall_score is not None else ""
    display_name = str(name).strip() if name and str(name).strip() else "there"
    text = f"""Hi {display_name},

Thanks for requesting your complimentary expert review from weROI. We have reviewed your GrowthIQ assessment for {business_name} and would love to walk through the findings with you.
{score_text}{note_text}{times_text}
Book your call: {calendly_url}

Pick a time that works for you. This is a short, no-pressure conversation to review your report and answer questions.

If none of the listed times work, reply to this email and we will find another slot.

Talk soon,
The weROI Team
"""
    return {
        "subject": f"Book your weROI expert review call, {display_name}",
        "html": get_premium_email_template(
            content,
            headline="Let's review your GrowthIQ report",
            cta_text="Book Your Call",
            cta_link=calendly_url,
            preheader=f"Schedule your complimentary expert review for {business_name}.",
        ),
        "text": text,
    }


GROWTHIQ_URL = f"{SITE_URL}/growth-preview"


def get_visibility_checklist_email_content(name: str | None = None) -> dict:
    """Exit-intent checklist email with PDF download link (weROI branded, not legacy growth guide)."""
    greeting = _greeting(name)

    items_html = "".join(
        f'<p style="margin: 0 0 14px 0;"><strong style="color: {BRAND_DARK};">{i}. {_e(title)}</strong><br>'
        f'<span style="color: #555;">{_e(desc)}</span></p>'
        for i, (title, desc) in enumerate(VISIBILITY_CHECKLIST_ITEMS, 1)
    )

    body_html = f"""
    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.7; color: #333;">
      {greeting}
    </p>
    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.7; color: #333;">
      You made a smart move. Most business owners never pause to ask whether they are actually visible online.
      You did. That is the first step to fixing what is quietly costing you customers.
    </p>
    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.7; color: #333;">
      {_e(VISIBILITY_CHECKLIST_INTRO)}
    </p>
    {_section_box("Inside your PDF checklist", items_html)}
    {_section_box("weROI Insight", '<em>"Visibility problems look like business problems. Fix findability first."</em>')}
    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.7; color: #333;">
      {_e(VISIBILITY_CHECKLIST_CLOSING)}
    </p>
    <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #333;">
      <strong style="color: {BRAND_DARK};">Your PDF is attached to this email.</strong>
      You can also download it anytime using the button below.
    </p>
    <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.7; color: #333;">
      Want the full picture? Get your free personalized
      <a href="{GROWTHIQ_URL}" style="color: {BRAND_DARK}; font-weight: 600;">weROI GrowthIQ™ score</a>
      in 3-5 minutes. No sales call unless you ask for one.
    </p>
    <p style="margin: 24px 0 0 0; font-size: 14px; color: #666;">Talk soon,<br><strong style="color: {BRAND_DARK};">The weROI Team</strong></p>
    """

    text_items = "\n\n".join(
        f"{i}. {title}\n{desc}" for i, (title, desc) in enumerate(VISIBILITY_CHECKLIST_ITEMS, 1)
    )
    display = "there" if not name or not str(name).strip() else str(name).strip()
    text = f"""Hi {display},

You made a smart move. Most business owners never pause to ask whether they are actually visible online.

{VISIBILITY_CHECKLIST_INTRO}

YOUR CHECKLIST (also attached as PDF):

{text_items}

{VISIBILITY_CHECKLIST_CLOSING}

Download your PDF: {VISIBILITY_CHECKLIST_PDF_URL}

Get your free GrowthIQ score: {GROWTHIQ_URL}

Talk soon,
The weROI Team
"""

    return {
        "subject": f"Your PDF: {VISIBILITY_CHECKLIST_TITLE} | weROI",
        "html": get_premium_email_template(
            body_html,
            headline=VISIBILITY_CHECKLIST_TITLE,
            cta_text="Download Your Checklist (PDF)",
            cta_link=VISIBILITY_CHECKLIST_PDF_URL,
            preheader="Your weROI visibility checklist PDF is ready. Five quick signs to review.",
        ),
        "text": text,
    }
