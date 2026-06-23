import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SiteHeader from './SiteHeader';
import GlowButton from './ui/GlowButton';

const TOTAL_STEPS = 4;

const STEP_LABELS = ['Contact', 'Business', 'Project', 'Details'];

const HEAR_ABOUT_OPTIONS = [
  'Google',
  'Instagram',
  'Facebook',
  'Referral',
  'Word of mouth',
  'LinkedIn',
  'TikTok',
  'Event',
  'Other',
];

const SERVICE_OPTIONS = [
  'Website',
  'Mobile App',
  'Branding',
  'SEO',
  'Marketing',
  'Funnels',
  'CRM Setup',
  'Automation',
  'Social Media',
  'E-commerce',
];

const TIMELINE_OPTIONS = [
  'Immediately',
  'Within 1 month',
  '1-3 months',
  'Just exploring',
];

const INITIAL_DATA = {
  name: '',
  email: '',
  phone: '',
  how_found_us: '',
  company_name: '',
  business_description: '',
  services_interested: [],
  timeline: '',
  additional_details: '',
};

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -32 : 32, opacity: 0 }),
};

export default function AuditForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});

  const API_URL = process.env.REACT_APP_BACKEND_URL || '';
  const sid = (() => {
    const e = sessionStorage.getItem('sessionId');
    if (e) return e;
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', id);
    return id;
  })();

  const track = (event_type) => {
    fetch(`${API_URL}/api/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type, page: '/audit', referrer: document.referrer || null, session_id: sid }),
    }).catch(() => {});
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    track('audit_form_start');
    track('page_view');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const onChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleService = (service) => {
    setData((prev) => {
      const selected = prev.services_interested.includes(service)
        ? prev.services_interested.filter((s) => s !== service)
        : [...prev.services_interested, service];
      return { ...prev, services_interested: selected };
    });
    if (errors.services_interested) setErrors((prev) => ({ ...prev, services_interested: '' }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!data.name.trim()) e.name = 'Name is required';
      if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email';
      if (!data.phone.trim() || !/^[\d\s\-+()]{10,}$/.test(data.phone)) e.phone = 'Enter a valid phone number';
      if (!data.how_found_us) e.how_found_us = 'Please select an option';
    }
    if (step === 2) {
      if (!data.company_name.trim()) e.company_name = 'Business name is required';
      if (!data.business_description.trim()) e.business_description = 'Tell us a bit about your business';
    }
    if (step === 3) {
      if (data.services_interested.length === 0) e.services_interested = 'Select at least one service';
      if (!data.timeline) e.timeline = 'Pick when you want to start';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (validateStep()) {
      setDirection(1);
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const goPrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const r = await fetch(`${API_URL}/api/leads/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, referrer: document.referrer || null }),
      });
      if (r.ok) track('audit_form_submit');
    } catch {
      // still continue to thank-you
    }
    sessionStorage.setItem('auditFormData', JSON.stringify(data));
    navigate('/thank-you?type=audit');
  };

  const renderContactStep = () => (
  <div className="audit-fields-grid">
    <div className="audit-field">
      <label className="audit-label" htmlFor="audit-name">Full name</label>
      <input
        id="audit-name"
        type="text"
        data-testid="audit-name-input"
        className={`audit-input ${errors.name ? 'error' : ''}`}
        placeholder="Your full name"
        value={data.name}
        onChange={(e) => onChange('name', e.target.value)}
        autoComplete="name"
      />
      {errors.name && <span className="audit-error">{errors.name}</span>}
    </div>

    <div className="audit-field">
      <label className="audit-label" htmlFor="audit-email">Email</label>
      <input
        id="audit-email"
        type="email"
        data-testid="audit-email-input"
        className={`audit-input ${errors.email ? 'error' : ''}`}
        placeholder="name@yourbusiness.com"
        value={data.email}
        onChange={(e) => onChange('email', e.target.value)}
        autoComplete="email"
      />
      {errors.email && <span className="audit-error">{errors.email}</span>}
    </div>

    <div className="audit-field">
      <label className="audit-label" htmlFor="audit-phone">Phone</label>
      <input
        id="audit-phone"
        type="tel"
        data-testid="audit-phone-input"
        className={`audit-input ${errors.phone ? 'error' : ''}`}
        placeholder="+1 (876) 555-1234"
        value={data.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        autoComplete="tel"
      />
      {errors.phone && <span className="audit-error">{errors.phone}</span>}
    </div>

    <div className="audit-field">
      <label className="audit-label" htmlFor="audit-source">How did you hear about us?</label>
      <select
        id="audit-source"
        data-testid="audit-how-found-select"
        className={`audit-select ${errors.how_found_us ? 'error' : ''}`}
        value={data.how_found_us}
        onChange={(e) => onChange('how_found_us', e.target.value)}
      >
        <option value="">Select an option</option>
        {HEAR_ABOUT_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {errors.how_found_us && <span className="audit-error">{errors.how_found_us}</span>}
    </div>
  </div>
  );

  const renderBusinessStep = () => (
  <div className="audit-fields-grid">
    <div className="audit-field">
      <label className="audit-label" htmlFor="audit-company">Business or brand name</label>
      <input
        id="audit-company"
        type="text"
        data-testid="audit-company-name-input"
        className={`audit-input ${errors.company_name ? 'error' : ''}`}
        placeholder="Your business name"
        value={data.company_name}
        onChange={(e) => onChange('company_name', e.target.value)}
        autoComplete="organization"
      />
      {errors.company_name && <span className="audit-error">{errors.company_name}</span>}
    </div>

    <div className="audit-field audit-field--full">
      <label className="audit-label" htmlFor="audit-about">Tell us about your business</label>
      <textarea
        id="audit-about"
        data-testid="audit-business-description"
        className={`audit-textarea ${errors.business_description ? 'error' : ''}`}
        placeholder="What do you sell, who do you serve, and what are you trying to grow?"
        rows={5}
        value={data.business_description}
        onChange={(e) => onChange('business_description', e.target.value)}
      />
      {errors.business_description && <span className="audit-error">{errors.business_description}</span>}
    </div>
  </div>
  );

  const renderProjectStep = () => (
  <div className="audit-fields-grid">
    <div className="audit-field audit-field--full">
      <span className="audit-label">Services you are interested in</span>
      <div className="audit-chips" role="group" aria-label="Services interested in">
        {SERVICE_OPTIONS.map((service) => (
          <button
            key={service}
            type="button"
            className={`audit-chip ${data.services_interested.includes(service) ? 'selected' : ''}`}
            onClick={() => toggleService(service)}
            aria-pressed={data.services_interested.includes(service)}
          >
            {data.services_interested.includes(service) && <Check size={14} strokeWidth={2.5} aria-hidden="true" />}
            {service}
          </button>
        ))}
      </div>
      {errors.services_interested && <span className="audit-error">{errors.services_interested}</span>}
    </div>

    <div className="audit-field audit-field--full">
      <span className="audit-label">When do you want to start?</span>
      <div className="audit-chips" role="radiogroup" aria-label="Project timeline">
        {TIMELINE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            className={`audit-chip ${data.timeline === option ? 'selected' : ''}`}
            onClick={() => onChange('timeline', option)}
            aria-pressed={data.timeline === option}
          >
            {option}
          </button>
        ))}
      </div>
      {errors.timeline && <span className="audit-error">{errors.timeline}</span>}
    </div>
  </div>
  );

  const renderDetailsStep = () => (
  <div className="audit-fields-grid">
    <div className="audit-field audit-field--full">
      <label className="audit-label" htmlFor="audit-details">Anything else we should know?</label>
      <textarea
        id="audit-details"
        data-testid="audit-additional-details"
        className="audit-textarea"
        placeholder="Goals, challenges, links to your current site or social pages, or questions for our team."
        rows={6}
        value={data.additional_details}
        onChange={(e) => onChange('additional_details', e.target.value)}
      />
    </div>
  </div>
  );

  const stepContent = [renderContactStep, renderBusinessStep, renderProjectStep, renderDetailsStep];

  return (
    <div className="audit-page audit-page--quote" data-testid="audit-page">
      <SiteHeader
        className="audit-header"
        hideLogo
        navTestId="audit-nav"
        showCenterLinks={false}
        showDesktopCta={false}
        innerClassName="audit-header-row audit-header-row--no-logo container nav-inner"
        desktopActions={
          <Link to="/" className="audit-back" data-testid="audit-back-home" aria-label="Back to home">
            <ArrowLeft size={14} /> Home
          </Link>
        }
      />

      <div className="audit-quote-layout">
        <header className="audit-quote-header">
          <span className="audit-eyebrow">Free Growth Audit</span>
          <h1 className="audit-quote-title">Start your project with weROI</h1>
          <p className="audit-quote-subtitle">
            Tell us about your business and what you need. We will review your setup and send a free growth audit within 48 hours.
          </p>
        </header>

        <nav className="audit-steps-bar" aria-label="Form progress">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isDone = stepNum < step;
            const isActive = stepNum === step;
            return (
              <div
                key={label}
                className={`audit-steps-bar-item${isDone ? ' is-done' : ''}${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="audit-steps-bar-marker" aria-hidden="true">
                  {isDone ? <Check size={12} strokeWidth={2.5} /> : stepNum}
                </span>
                <span className="audit-steps-bar-label">{label}</span>
                {i < STEP_LABELS.length - 1 && <span className="audit-steps-bar-line" aria-hidden="true" />}
              </div>
            );
          })}
        </nav>

        <div className="audit-form-card audit-form-card--quote">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              className="audit-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="audit-step-heading">
                <span className="audit-step-key">Step {step} of {TOTAL_STEPS}</span>
                <h2 className="audit-step-title">{STEP_LABELS[step - 1]}</h2>
              </div>

              {stepContent[step - 1]()}

              <div className="audit-nav">
                {step > 1 ? (
                  <GlowButton
                    variant="ghost"
                    onClick={goPrev}
                    data-testid="prev-step-btn"
                    className="audit-nav-btn audit-nav-back"
                  >
                    <ArrowLeft size={16} /> Back
                  </GlowButton>
                ) : (
                  <span className="audit-nav-spacer" aria-hidden="true" />
                )}

                {step < TOTAL_STEPS ? (
                  <GlowButton
                    onClick={goNext}
                    data-testid="next-step-btn"
                    className="audit-nav-btn audit-nav-primary"
                  >
                    Continue <ArrowRight size={16} />
                  </GlowButton>
                ) : (
                  <GlowButton
                    onClick={submit}
                    disabled={submitting}
                    data-testid="submit-audit-btn"
                    className="audit-nav-btn audit-nav-primary"
                  >
                    {submitting ? 'Submitting…' : 'Get My Free Audit'}
                    {!submitting && <ArrowRight size={16} />}
                  </GlowButton>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="audit-quote-footer">
          We only work with a limited number of clients to ensure quality.
        </p>
      </div>
    </div>
  );
}
