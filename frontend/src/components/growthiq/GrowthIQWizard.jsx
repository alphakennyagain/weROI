import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlowButton from '../ui/GlowButton';
import HelpTip from './HelpTip';
import {
  STEP_LABELS,
  INDUSTRIES,
  BUSINESS_SIZES,
  YEARS_IN_BUSINESS,
  PRIMARY_GOALS,
  CONTACT_METHODS,
  COUNTRIES,
  DIGITAL_PRESENCE_FIELDS,
  INITIAL_FORM_DATA,
  GOAL_QUESTIONS,
  STEP_ENCOURAGEMENT,
  SOCIAL_PLATFORMS,
  ANALYTICS_TOOLS,
  AUTOMATION_TOOLS,
  loadDraft,
  saveDraft,
  clearDraft,
  getProgressPercent,
  getEstimatedMinutesRemaining,
  prepareSubmissionData,
} from '../../data/growthiqConstants';

const TOTAL_STEPS = 4;

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -32 : 32, opacity: 0 }),
};

function ToggleGroup({ options, value, onChange, name }) {
  return (
    <div className="giq-toggle-group" role="radiogroup" aria-label={name}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={value === opt}
          className={`giq-toggle-btn${value === opt ? ' is-selected' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function CheckboxGroup({ options, values, onChange }) {
  const toggle = (opt) => {
    const next = values.includes(opt)
      ? values.filter((v) => v !== opt)
      : [...values, opt];
    onChange(next);
  };
  return (
    <div className="giq-checkbox-group">
      {options.map((opt) => (
        <label key={opt} className={`giq-checkbox-label${values.includes(opt) ? ' is-checked' : ''}`}>
          <input
            type="checkbox"
            checked={values.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export default function GrowthIQWizard({ onComplete, onStepChange, initialResume }) {
  const draft = loadDraft();
  const [step, setStep] = useState(initialResume && draft ? draft.step : 1);
  const [subStep, setSubStep] = useState(initialResume && draft ? draft.subStep : 0);
  const [direction, setDirection] = useState(1);
  const [gbpHelpOpen, setGbpHelpOpen] = useState(false);
  const [data, setData] = useState(() => {
    if (initialResume && draft) return draft.data;
    return { ...INITIAL_FORM_DATA };
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    saveDraft(step, subStep, data);
  }, [step, subStep, data]);

  useEffect(() => {
    onStepChange?.(step);
    document.getElementById('giq-assessment-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step, subStep, onStepChange]);

  const onChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const onPresenceChange = (key, val) => {
    setData((prev) => ({
      ...prev,
      digital_presence: { ...prev.digital_presence, [key]: val },
    }));
    if (errors.digital_presence) setErrors((prev) => ({ ...prev, digital_presence: '' }));
  };

  const encouragement = useCallback(() => {
    const msgs = STEP_ENCOURAGEMENT[step] || STEP_ENCOURAGEMENT[4];
    const idx = Math.min(subStep, msgs.length - 1);
    return msgs[idx];
  }, [step, subStep]);

  const validateContact = () => {
    const e = {};
    if (!data.full_name.trim()) e.full_name = 'Full name is required';
    if (!data.business_name.trim()) e.business_name = 'Business name is required';
    if (!data.business_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.business_email)) {
      e.business_email = 'Enter a valid business email';
    }
    if (!data.phone.trim() || !/^[\d\s\-+()]{7,}$/.test(data.phone)) e.phone = 'Enter a valid phone number';
    if (!data.country) e.country = 'Select your country';
    if (data.country === 'Other' && !data.country_other.trim()) e.country_other = 'Please specify your country';
    if (!data.preferred_contact) e.preferred_contact = 'Select preferred contact method';
    return e;
  };

  const validateBusiness = () => {
    const e = {};
    if (!data.industry) e.industry = 'Select your industry';
    if (data.industry === 'Other' && !data.industry_other.trim()) e.industry_other = 'Please specify your industry';
    if (!data.business_size) e.business_size = 'Select business size';
    if (!data.years_in_business) e.years_in_business = 'Select years in business';
    if (!data.primary_goal) e.primary_goal = 'Select your primary goal';
    if (data.primary_goal === 'Other' && !data.primary_goal_other.trim()) e.primary_goal_other = 'Please describe your goal';
    return e;
  };

  const validatePresenceSubStep = () => {
    const e = {};
    const field = DIGITAL_PRESENCE_FIELDS[subStep];
    if (!field) return e;
    if (!data.digital_presence[field.key]) {
      e.digital_presence = `Please answer: ${field.label}`;
      return e;
    }
    const val = data.digital_presence[field.key];
    if (field.key === 'website' && val === 'Yes' && !data.website_url.trim()) {
      e.website_url = 'Please enter your website URL';
    }
    if (field.key === 'gbp' && val === 'Yes' && !data.google_business_profile.trim()) {
      e.google_business_profile = 'Please enter your Google Business Profile link';
    }
    if (field.key === 'social_media' && val === 'Yes') {
      if (!data.social_platforms.length) e.social_platforms = 'Select at least one platform';
      const missingLink = data.social_platforms.some(
        (p) => p !== 'Other' && !(data.social_platform_links[p] || '').trim(),
      );
      if (missingLink) e.social_links = 'Enter a link for each selected platform';
      if (data.social_platforms.includes('Other') && !data.social_other.trim()) {
        e.social_other = 'Please specify other platform';
      }
    }
    if (field.key === 'analytics' && val === 'Yes') {
      if (!data.analytics_tools.length) e.analytics_tools = 'Select at least one tool';
      if (data.analytics_tools.includes('Other') && !data.analytics_other.trim()) {
        e.analytics_other = 'Please specify other analytics tool';
      }
    }
    if (field.key === 'automation' && val === 'Yes') {
      if (!data.automation_tools.length) e.automation_tools = 'Select at least one tool';
      if (data.automation_tools.includes('Other') && !data.automation_other.trim()) {
        e.automation_other = 'Please specify other automation tool';
      }
    }
    return e;
  };

  const validateGoalSubStep = () => {
    const e = {};
    const q = GOAL_QUESTIONS[subStep];
    if (!q) return e;
    if (!data[q.key]?.trim() || data[q.key].trim().length < 10) {
      e[q.key] = 'Please share at least a sentence (10+ characters)';
    }
    return e;
  };

  const validateCurrent = () => {
    let e = {};
    if (step === 1) e = validateContact();
    else if (step === 2) e = validateBusiness();
    else if (step === 3) e = validatePresenceSubStep();
    else if (step === 4) e = validateGoalSubStep();
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateCurrent()) return;
    setDirection(1);
    if (step === 3 && subStep < DIGITAL_PRESENCE_FIELDS.length - 1) {
      setSubStep((s) => s + 1);
    } else if (step === 4 && subStep < GOAL_QUESTIONS.length - 1) {
      setSubStep((s) => s + 1);
    } else if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      setSubStep(0);
    }
  };

  const goPrev = () => {
    setDirection(-1);
    if (step === 3 && subStep > 0) {
      setSubStep((s) => s - 1);
    } else if (step === 4 && subStep > 0) {
      setSubStep((s) => s - 1);
    } else if (step > 1) {
      const prevStep = step - 1;
      setStep(prevStep);
      if (prevStep === 3) setSubStep(DIGITAL_PRESENCE_FIELDS.length - 1);
      else if (prevStep === 4) setSubStep(GOAL_QUESTIONS.length - 1);
      else setSubStep(0);
    }
  };

  const submit = () => {
    if (!validateCurrent()) return;
    onComplete(prepareSubmissionData(data));
  };

  const handleStartOver = () => {
    if (window.confirm('Start over? Your saved progress will be cleared.')) {
      clearDraft();
      setData({ ...INITIAL_FORM_DATA });
      setStep(1);
      setSubStep(0);
      setErrors({});
    }
  };

  const handleClearProgress = () => {
    if (window.confirm('Clear saved progress? You will start from the beginning.')) {
      clearDraft();
      setData({ ...INITIAL_FORM_DATA });
      setStep(1);
      setSubStep(0);
      setErrors({});
    }
  };

  const progress = getProgressPercent(step, subStep);
  const minutesLeft = getEstimatedMinutesRemaining(step, subStep);
  const isLastStep = step === 4 && subStep === GOAL_QUESTIONS.length - 1;

  const renderContact = () => (
    <div className="giq-fields-grid">
      <div className="giq-field">
        <label className="giq-label" htmlFor="giq-name">Full Name</label>
        <input id="giq-name" className={`giq-input ${errors.full_name ? 'error' : ''}`} value={data.full_name} onChange={(e) => onChange('full_name', e.target.value)} placeholder="Your full name" autoComplete="name" />
        {errors.full_name && <span className="giq-error">{errors.full_name}</span>}
      </div>
      <div className="giq-field">
        <label className="giq-label" htmlFor="giq-business">Business Name</label>
        <input id="giq-business" className={`giq-input ${errors.business_name ? 'error' : ''}`} value={data.business_name} onChange={(e) => onChange('business_name', e.target.value)} placeholder="Your business name" />
        {errors.business_name && <span className="giq-error">{errors.business_name}</span>}
      </div>
      <div className="giq-field">
        <label className="giq-label" htmlFor="giq-email">Business Email</label>
        <input id="giq-email" type="email" className={`giq-input ${errors.business_email ? 'error' : ''}`} value={data.business_email} onChange={(e) => onChange('business_email', e.target.value)} placeholder="name@yourbusiness.com" autoComplete="email" />
        {errors.business_email && <span className="giq-error">{errors.business_email}</span>}
      </div>
      <div className="giq-field">
        <label className="giq-label" htmlFor="giq-phone">Phone</label>
        <input id="giq-phone" type="tel" className={`giq-input ${errors.phone ? 'error' : ''}`} value={data.phone} onChange={(e) => onChange('phone', e.target.value)} placeholder="+1 (876) 555-1234" autoComplete="tel" />
        {errors.phone && <span className="giq-error">{errors.phone}</span>}
      </div>
      <div className="giq-field giq-field--full">
        <label className="giq-label">Country</label>
        <ToggleGroup options={COUNTRIES} value={data.country} onChange={(v) => onChange('country', v)} name="Country" />
        {data.country === 'Other' && (
          <input className={`giq-input giq-input--mt ${errors.country_other ? 'error' : ''}`} value={data.country_other} onChange={(e) => onChange('country_other', e.target.value)} placeholder="Your country" />
        )}
        {errors.country && <span className="giq-error">{errors.country}</span>}
        {errors.country_other && <span className="giq-error">{errors.country_other}</span>}
      </div>
      <div className="giq-field giq-field--full">
        <label className="giq-label">Preferred Contact Method</label>
        <ToggleGroup options={CONTACT_METHODS} value={data.preferred_contact} onChange={(v) => onChange('preferred_contact', v)} name="Contact method" />
      </div>
    </div>
  );

  const renderBusiness = () => (
    <div className="giq-fields-grid">
      <div className="giq-field giq-field--full">
        <label className="giq-label">Industry</label>
        <div className="giq-toggle-group giq-toggle-group--wrap">
          {INDUSTRIES.map((i) => (
            <button key={i} type="button" className={`giq-toggle-btn${data.industry === i ? ' is-selected' : ''}`} onClick={() => onChange('industry', i)}>{i}</button>
          ))}
        </div>
        {data.industry === 'Other' && (
          <input className={`giq-input giq-input--mt ${errors.industry_other ? 'error' : ''}`} value={data.industry_other} onChange={(e) => onChange('industry_other', e.target.value)} placeholder="Your industry" />
        )}
        {errors.industry && <span className="giq-error">{errors.industry}</span>}
        {errors.industry_other && <span className="giq-error">{errors.industry_other}</span>}
      </div>
      <div className="giq-field giq-field--full">
        <label className="giq-label">Business Size</label>
        <ToggleGroup options={BUSINESS_SIZES} value={data.business_size} onChange={(v) => onChange('business_size', v)} name="Business size" />
        {errors.business_size && <span className="giq-error">{errors.business_size}</span>}
      </div>
      <div className="giq-field giq-field--full">
        <label className="giq-label">Years in Business</label>
        <ToggleGroup options={YEARS_IN_BUSINESS} value={data.years_in_business} onChange={(v) => onChange('years_in_business', v)} name="Years in business" />
        {errors.years_in_business && <span className="giq-error">{errors.years_in_business}</span>}
      </div>
      <div className="giq-field giq-field--full">
        <label className="giq-label">Primary Goal</label>
        <div className="giq-toggle-group giq-toggle-group--wrap">
          {PRIMARY_GOALS.map((g) => (
            <button key={g} type="button" className={`giq-toggle-btn${data.primary_goal === g ? ' is-selected' : ''}`} onClick={() => onChange('primary_goal', g)}>{g}</button>
          ))}
        </div>
        {data.primary_goal === 'Other' && (
          <input className={`giq-input giq-input--mt ${errors.primary_goal_other ? 'error' : ''}`} value={data.primary_goal_other} onChange={(e) => onChange('primary_goal_other', e.target.value)} placeholder="Describe your primary goal" />
        )}
        {errors.primary_goal && <span className="giq-error">{errors.primary_goal}</span>}
        {errors.primary_goal_other && <span className="giq-error">{errors.primary_goal_other}</span>}
      </div>
    </div>
  );

  const renderPresenceSubStep = () => {
    const field = DIGITAL_PRESENCE_FIELDS[subStep];
    if (!field) return null;
    const val = data.digital_presence[field.key];

    return (
      <div className="giq-presence-single">
        <div className="giq-presence-question">
          <label className="giq-label giq-label--lg">
            Do you have {field.label.toLowerCase()} set up?
            {field.help && <HelpTip text={field.help} label={`About ${field.label}`} />}
          </label>
          <ToggleGroup
            options={field.options}
            value={val}
            onChange={(v) => onPresenceChange(field.key, v)}
            name={field.label}
          />
          {errors.digital_presence && <span className="giq-error">{errors.digital_presence}</span>}
        </div>

        {field.key === 'website' && val === 'Yes' && (
          <div className="giq-conditional">
            <label className="giq-label" htmlFor="giq-website-url">Website URL</label>
            <input id="giq-website-url" className={`giq-input ${errors.website_url ? 'error' : ''}`} value={data.website_url} onChange={(e) => onChange('website_url', e.target.value)} placeholder="https://yourbusiness.com" />
            {errors.website_url && <span className="giq-error">{errors.website_url}</span>}
          </div>
        )}

        {field.key === 'website' && val === 'No' && (
          <div className="giq-note giq-note--info">
            No problem. We will skip live website analysis. Your report may still include website-related opportunities, and a complimentary expert review could cover concepts for your future site (not guaranteed).
          </div>
        )}

        {field.key === 'gbp' && val === 'Yes' && (
          <div className="giq-conditional">
            <label className="giq-label" htmlFor="giq-gbp">Google Business Profile link</label>
            <input id="giq-gbp" className={`giq-input ${errors.google_business_profile ? 'error' : ''}`} value={data.google_business_profile} onChange={(e) => onChange('google_business_profile', e.target.value)} placeholder="https://maps.google.com/..." />
            {errors.google_business_profile && <span className="giq-error">{errors.google_business_profile}</span>}
            <button type="button" className="giq-expand-help" onClick={() => setGbpHelpOpen(!gbpHelpOpen)}>
              How to copy your GBP link {gbpHelpOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {gbpHelpOpen && (
              <div className="giq-expand-content">
                <ol>
                  <li>Search your business on Google Maps or Google Search.</li>
                  <li>Click your business listing to open the profile.</li>
                  <li>Click the Share button and copy the link.</li>
                  <li>Paste the link above.</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {field.key === 'social_media' && val === 'Yes' && (
          <div className="giq-conditional">
            <label className="giq-label">Which platforms are you active on?</label>
            <CheckboxGroup options={SOCIAL_PLATFORMS} values={data.social_platforms} onChange={(v) => onChange('social_platforms', v)} />
            {errors.social_platforms && <span className="giq-error">{errors.social_platforms}</span>}
            {data.social_platforms.filter((p) => p !== 'Other').map((platform) => (
              <div key={platform} className="giq-field giq-field--mt">
                <label className="giq-label">{platform} profile URL</label>
                <input
                  className={`giq-input ${errors.social_links ? 'error' : ''}`}
                  value={data.social_platform_links[platform] || ''}
                  onChange={(e) => onChange('social_platform_links', { ...data.social_platform_links, [platform]: e.target.value })}
                  placeholder={`https://${platform.toLowerCase().replace(/[^a-z]/g, '')}.com/yourprofile`}
                />
              </div>
            ))}
            {data.social_platforms.includes('Other') && (
              <div className="giq-field giq-field--mt">
                <label className="giq-label">Other platform name</label>
                <input className={`giq-input ${errors.social_other ? 'error' : ''}`} value={data.social_other} onChange={(e) => onChange('social_other', e.target.value)} placeholder="Platform name" />
                {errors.social_other && <span className="giq-error">{errors.social_other}</span>}
              </div>
            )}
            {errors.social_links && <span className="giq-error">{errors.social_links}</span>}
          </div>
        )}

        {field.key === 'analytics' && val === 'Yes' && (
          <div className="giq-conditional">
            <label className="giq-label">Which analytics tools do you use?</label>
            <CheckboxGroup options={ANALYTICS_TOOLS} values={data.analytics_tools} onChange={(v) => onChange('analytics_tools', v)} />
            {errors.analytics_tools && <span className="giq-error">{errors.analytics_tools}</span>}
            {data.analytics_tools.includes('Other') && (
              <input className={`giq-input giq-input--mt ${errors.analytics_other ? 'error' : ''}`} value={data.analytics_other} onChange={(e) => onChange('analytics_other', e.target.value)} placeholder="Other analytics tool" />
            )}
            {errors.analytics_other && <span className="giq-error">{errors.analytics_other}</span>}
          </div>
        )}

        {field.key === 'automation' && val === 'Yes' && (
          <div className="giq-conditional">
            <label className="giq-label">Which automation tools do you use?</label>
            <CheckboxGroup options={AUTOMATION_TOOLS} values={data.automation_tools} onChange={(v) => onChange('automation_tools', v)} />
            {errors.automation_tools && <span className="giq-error">{errors.automation_tools}</span>}
            {data.automation_tools.includes('Other') && (
              <input className={`giq-input giq-input--mt ${errors.automation_other ? 'error' : ''}`} value={data.automation_other} onChange={(e) => onChange('automation_other', e.target.value)} placeholder="Other automation tool" />
            )}
            {errors.automation_other && <span className="giq-error">{errors.automation_other}</span>}
          </div>
        )}

        <p className="giq-presence-progress">
          Question {subStep + 1} of {DIGITAL_PRESENCE_FIELDS.length}
        </p>
      </div>
    );
  };

  const renderGoalSubStep = () => {
    const q = GOAL_QUESTIONS[subStep];
    if (!q) return null;
    return (
      <div className="giq-fields-grid">
        <div className="giq-field giq-field--full">
          <label className="giq-label" htmlFor={`giq-${q.key}`}>{q.label}</label>
          <textarea
            id={`giq-${q.key}`}
            className={`giq-textarea ${errors[q.key] ? 'error' : ''}`}
            rows={4}
            value={data[q.key]}
            onChange={(e) => onChange(q.key, e.target.value)}
            placeholder={q.placeholder}
          />
          {errors[q.key] && <span className="giq-error">{errors[q.key]}</span>}
          <p className="giq-presence-progress">
            Question {subStep + 1} of {GOAL_QUESTIONS.length}
          </p>
        </div>
      </div>
    );
  };

  const stepContent = () => {
    if (step === 1) return renderContact();
    if (step === 2) return renderBusiness();
    if (step === 3) return renderPresenceSubStep();
    return renderGoalSubStep();
  };

  const stepTitle = () => {
    if (step === 3) return DIGITAL_PRESENCE_FIELDS[subStep]?.label || 'Digital Presence';
    if (step === 4) return 'Your Goals';
    return STEP_LABELS[step - 1];
  };

  return (
    <div className="giq-wizard" id="giq-assessment-form">
      <div className="giq-progress-meta">
        <div className="giq-progress-stats">
          <span>Progress: <strong>{progress}%</strong></span>
          <span>Est. time remaining: <strong>{minutesLeft} min</strong></span>
        </div>
        <div className="giq-progress-bar" aria-hidden="true">
          <div className="giq-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <nav className="giq-steps-bar" aria-label="Assessment progress">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < step;
          const isActive = stepNum === step;
          return (
            <div key={label} className={`giq-steps-item${isDone ? ' is-done' : ''}${isActive ? ' is-active' : ''}`} aria-current={isActive ? 'step' : undefined}>
              <span className="giq-steps-marker">{isDone ? <Check size={12} /> : stepNum}</span>
              <span className="giq-steps-label">{label}</span>
            </div>
          );
        })}
      </nav>

      <div className="giq-form-card">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${step}-${subStep}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="giq-step"
          >
            <div className="giq-step-heading">
              <span className="giq-step-key">Step {step} of {TOTAL_STEPS}</span>
              <h2 className="giq-step-title">{stepTitle()}</h2>
              <p className="giq-step-micro giq-encouragement">{encouragement()}</p>
            </div>

            {stepContent()}

            <div className="giq-wizard-actions">
              <button type="button" className="giq-text-btn" onClick={handleClearProgress}>Clear Saved Progress</button>
              <button type="button" className="giq-text-btn" onClick={handleStartOver}>Start Over</button>
            </div>

            <div className="giq-nav">
              {step > 1 || subStep > 0 ? (
                <GlowButton variant="ghost" onClick={goPrev} className="giq-nav-btn">
                  <ArrowLeft size={16} /> Back
                </GlowButton>
              ) : <span className="giq-nav-spacer" />}
              {!isLastStep ? (
                <GlowButton onClick={goNext} className="giq-nav-btn giq-nav-primary">
                  Continue <ArrowRight size={16} />
                </GlowButton>
              ) : (
                <GlowButton onClick={submit} className="giq-nav-btn giq-nav-primary">
                  Generate My GrowthIQ™ Report <ArrowRight size={16} />
                </GlowButton>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
