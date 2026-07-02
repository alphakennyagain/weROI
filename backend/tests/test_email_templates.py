"""Unit tests for email template rendering."""

from email_templates import (
    get_audit_confirmation_email,
    get_audit_owner_notification_email,
    get_email_1_content,
    get_growth_audit_email,
)


class FakeLead:
  def __init__(self):
    self.name = "Jane Doe"
    self.email = "jane@example.com"
    self.phone = "+1 555 0100"
    self.company_name = "Acme Corp"
    self.website = "https://acme.com"
    self.how_found_us = "Google"
    self.business_description = "Local HVAC contractor"
    self.services_interested = ["SEO", "Funnels"]
    self.timeline = "1-3 months"
    self.additional_details = "Looking to scale lead gen"


def test_audit_confirmation_has_required_fields():
    email = get_audit_confirmation_email("Jane", "Acme Corp")
    assert "Jane" in email["subject"]
    assert "Acme Corp" in email["html"]
    assert "Acme Corp" in email["text"]
    assert "weROI" in email["html"]
    assert "c8f542" in email["html"]


def test_growth_audit_personalization():
    email = get_growth_audit_email(
        "Jane",
        "Acme Corp",
        business_description="Local HVAC contractor",
        services_interested=["SEO", "Funnels"],
        timeline="1-3 months",
    )
    assert "Acme Corp" in email["subject"]
    assert "SEO" in email["html"]
    assert "Website" in email["html"]
    assert "SEO &amp; Visibility" in email["html"] or "SEO & Visibility" in email["text"]
    assert len(email["text"]) > 100


def test_owner_notification_includes_lead_details():
    lead = FakeLead()
    email = get_audit_owner_notification_email(lead)
    assert lead.email in email["html"]
    assert lead.phone in email["text"]
    assert "SEO" in email["html"]


def test_guide_email_1_has_pdf_link():
    email = get_email_1_content("Jane")
    assert "growth guide" in email["subject"].lower()
    assert "Download Your Growth Guide" in email["html"]
    assert email["text"]


def test_visibility_checklist_email_branded():
    from email_templates import get_visibility_checklist_email_content

    email = get_visibility_checklist_email_content()
    assert "Invisible Online" in email["subject"]
    assert "Download Your Checklist" in email["html"]
    assert "weROI-Visibility-Checklist.pdf" in email["html"]
    assert "Growth Guide" not in email["subject"]
    assert "Hi there," in email["html"]


def test_growthiq_report_confirmation_email():
    from email_templates import get_growthiq_report_confirmation_email

    email = get_growthiq_report_confirmation_email(
        "Jane",
        "Acme Co",
        "abc-123-report",
        "jane@example.com",
        72,
        "B",
    )
    assert "abc-123-report" in email["html"]
    assert "abc-123-report" in email["text"]
    assert "Open My Report" in email["html"]
    assert "jane@example.com" in email["html"]
    assert "GrowthIQ" in email["subject"]
