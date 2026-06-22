import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TOTAL_STEPS = 6;

const STEPS = [
  { key: 'NAME',    title: "What's your name?",                   field: 'name',         type: 'text',  placeholder: 'Enter your full name' },
  { key: 'PHONE',   title: "What's your phone number?",           field: 'phone',        type: 'tel',   placeholder: 'Enter your phone number' },
  { key: 'EMAIL',   title: "What's your email address?",          field: 'email',        type: 'email', placeholder: 'name@company.com' },
  { key: 'COMPANY', title: "What's your company name?",           field: 'company_name', type: 'text',  placeholder: 'Enter your company name' },
  { key: 'SITE',    title: "Your website or business page?",      field: 'website',      type: 'url',   placeholder: 'https://yourwebsite.com (optional)', hint: 'Website, Instagram or any business page. Optional but helpful.' },
  { key: 'SOURCE',  title: "How did you hear about us?",          field: 'how_found_us', type: 'options' },
];

const SOURCE_OPTIONS = [
  'Google Search',
  'Social Media (Instagram, LinkedIn, etc.)',
  'Referral from a friend or colleague',
  'Podcast or YouTube',
  'Online Advertisement',
  'Other',
];

export default function AuditForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({ name: '', phone: '', email: '', company_name: '', website: '', how_found_us: '' });
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

  const current = STEPS[step - 1];

  const validate = () => {
    const e = {};
    const v = data[current.field];
    if (current.field === 'name' && !v.trim()) e.name = 'Name is required';
    if (current.field === 'phone' && (!v.trim() || !/^[\d\s\-+()]{10,}$/.test(v))) e.phone = 'Enter a valid phone number';
    if (current.field === 'email' && (!v.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))) e.email = 'Enter a valid email';
    if (current.field === 'company_name' && !v.trim()) e.company_name = 'Company name is required';
    if (current.field === 'how_found_us' && !v) e.how_found_us = 'Please select an option';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(Math.min(step + 1, TOTAL_STEPS)); };
  const prev = () => setStep(Math.max(step - 1, 1));

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const r = await fetch(`${API_URL}/api/leads/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, referrer: document.referrer || null }),
      });
      if (!r.ok) throw new Error('failed');
    } catch (err) {
      // still continue
    }
    sessionStorage.setItem('auditFormData', JSON.stringify(data));
    navigate('/thank-you?type=audit');
  };

  const onChange = (field, val) => {
    setData({ ...data, [field]: val });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const renderField = () => {
    if (current.type === 'options') {
      return (
        <div className="audit-options">
          {SOURCE_OPTIONS.map((opt, i) => (
            <button
              key={opt}
              type="button"
              data-testid={`how-found-option-${i}`}
              className={`audit-option ${data.how_found_us === opt ? 'selected' : ''}`}
              onClick={() => onChange('how_found_us', opt)}
            >
              <span className="audit-radio" />
              <span>{opt}</span>
            </button>
          ))}
          {errors.how_found_us && <span className="audit-error">{errors.how_found_us}</span>}
        </div>
      );
    }
    return (
      <>
        <input
          type={current.type}
          data-testid={`audit-${current.field.replace('_','-')}-input`}
          className={`audit-input ${errors[current.field] ? 'error' : ''}`}
          placeholder={current.placeholder}
          value={data[current.field]}
          onChange={(e) => onChange(current.field, e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); step === TOTAL_STEPS ? submit() : next(); } }}
          autoFocus
        />
        {current.hint && <span className="audit-hint">{current.hint}</span>}
        {errors[current.field] && <span className="audit-error">{errors[current.field]}</span>}
      </>
    );
  };

  return (
    <div className="audit-page" data-testid="audit-page">
      <nav className="nav">
        <div className="container nav-inner">
          <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="brand-mark"><TrendingUp /></span>
            weROI
          </div>
          <div className="nav-links">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="nav-link">← Home</a>
          </div>
        </div>
      </nav>

      <div className="audit-wrap">
        <span className="pill audit-pill">
          <span className="pill-dot" />
          <span className="pill-mono">FREE AI GROWTH AUDIT</span>
        </span>

        <div className="audit-progress">
          <div className="audit-bar">
            <div className="audit-bar-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
          </div>
          <span className="audit-count">Step {String(step).padStart(2,'0')} / {String(TOTAL_STEPS).padStart(2,'0')}</span>
        </div>

        <div className="audit-card">
          <div className="audit-step-key">{current.key}</div>
          <h1 className="audit-step-title">{current.title}</h1>
          {renderField()}

          <div className="audit-nav">
            {step > 1 ? (
              <button className="btn btn-ghost" onClick={prev} data-testid="prev-step-btn">
                <ArrowLeft size={16} /> Back
              </button>
            ) : <span />}
            {step < TOTAL_STEPS ? (
              <button className="btn btn-primary" onClick={next} data-testid="next-step-btn">
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={submit} disabled={submitting} data-testid="submit-audit-btn">
                {submitting ? 'Submitting…' : 'Claim my free audit'} {!submitting && <ArrowRight size={16} />}
              </button>
            )}
          </div>
        </div>

        <div className="audit-trust">100% FREE · NO OBLIGATION · 48-HOUR TURNAROUND</div>
      </div>
    </div>
  );
}
