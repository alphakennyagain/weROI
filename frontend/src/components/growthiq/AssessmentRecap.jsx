import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { DIGITAL_PRESENCE_FIELDS } from '../../data/growthiqConstants';

const RECAP_FIELDS = [
  { key: 'full_name', label: 'Full name' },
  { key: 'business_name', label: 'Business name' },
  { key: 'business_email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone' },
  { key: 'country', label: 'Country' },
  { key: 'preferred_contact', label: 'Preferred contact' },
  { key: 'industry', label: 'Industry' },
  { key: 'business_size', label: 'Team size' },
  { key: 'years_in_business', label: 'Years in business' },
  { key: 'primary_goal', label: 'Primary goal' },
  { key: 'website', label: 'Website', type: 'url' },
  { key: 'google_business_profile', label: 'Google Business Profile', type: 'url', fullWidth: true },
  { key: 'social_links', label: 'Social links', fullWidth: true },
];

const GOAL_DETAIL_FIELDS = [
  { key: 'goal_customers', label: 'Ideal customers' },
  { key: 'goal_differentiator', label: 'Differentiator' },
  { key: 'goal_challenges', label: 'Challenges' },
  { key: 'goal_twelve_month', label: '12-month goals' },
  { key: 'goal_one_improvement', label: 'Top improvement' },
];

function normalizeHost(value) {
  if (!value) return '';
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

function toHref(value) {
  const trimmed = String(value).trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w.-]+\.[a-z]{2,}/i.test(trimmed)) return `https://${trimmed}`;
  if (trimmed.includes('.')) return `https://${trimmed}`;
  return trimmed;
}

function isLinkable(value) {
  const v = String(value).trim();
  return /^https?:\/\//i.test(v) || /^[\w.-]+\.[a-z]{2,}/i.test(v) || v.includes('share.google');
}

function RecapLink({ value }) {
  const href = toHref(value);
  const display = String(value).trim();
  if (!isLinkable(display)) {
    return <span className="giq-recap-value">{display}</span>;
  }
  return (
    <a
      className="giq-recap-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={display}
    >
      <span className="giq-recap-link-text">{display}</span>
      <ExternalLink size={12} aria-hidden="true" />
    </a>
  );
}

function RecapGoals({ assessment }) {
  const structured = GOAL_DETAIL_FIELDS.filter((f) => assessment[f.key]);
  if (structured.length > 0) {
    return (
      <dl className="giq-recap-goals">
        {structured.map((f) => (
          <div key={f.key} className="giq-recap-goals-row">
            <dt>{f.label}</dt>
            <dd>{assessment[f.key]}</dd>
          </div>
        ))}
      </dl>
    );
  }

  const text = assessment.business_goals;
  if (!text) return null;

  const parts = text.split(/\n\n+/).filter(Boolean);
  if (parts.length > 1) {
    return (
      <dl className="giq-recap-goals">
        {parts.map((part) => {
          const colon = part.indexOf(':');
          const label = colon > 0 ? part.slice(0, colon).trim() : 'Note';
          const body = colon > 0 ? part.slice(colon + 1).trim() : part.trim();
          return (
            <div key={part.slice(0, 30)} className="giq-recap-goals-row">
              <dt>{label}</dt>
              <dd>{body}</dd>
            </div>
          );
        })}
      </dl>
    );
  }

  return <p className="giq-recap-value giq-recap-value--text">{text}</p>;
}

function RecapValue({ field, value }) {
  if (field.type === 'url') return <RecapLink value={value} />;
  if (field.type === 'email') {
    return (
      <a className="giq-recap-link" href={`mailto:${value}`}>
        <span className="giq-recap-link-text">{value}</span>
      </a>
    );
  }
  return <span className="giq-recap-value">{value}</span>;
}

export default function AssessmentRecap({ assessment }) {
  const [open, setOpen] = useState(true);
  if (!assessment) return null;

  const presence = assessment.digital_presence || {};
  const presenceRows = DIGITAL_PRESENCE_FIELDS.map((f) => ({
    label: f.label,
    value: presence[f.key],
  })).filter((row) => row.value);

  const visibleFields = useMemo(() => {
    const websiteHost = normalizeHost(assessment.website);
    const urlHost = normalizeHost(assessment.website_url);

    return RECAP_FIELDS.filter((field) => {
      if (field.key === 'website') return Boolean(websiteHost || urlHost);
      return Boolean(assessment[field.key]);
    }).map((field) => {
      if (field.key === 'website') {
        return { ...field, value: assessment.website || assessment.website_url };
      }
      return { ...field, value: assessment[field.key] };
    });
  }, [assessment]);

  const hasGoals = GOAL_DETAIL_FIELDS.some((f) => assessment[f.key]) || assessment.business_goals;

  return (
    <section className="giq-assessment-recap">
      <button
        type="button"
        className="giq-assessment-recap-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <h2>What you told us</h2>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {open && (
        <div className="giq-assessment-recap-body">
          <div className="giq-recap-grid">
            {visibleFields.map((field) => (
              <div
                key={field.key}
                className={`giq-recap-item${field.fullWidth ? ' giq-recap-item--full' : ''}`}
              >
                <span className="giq-recap-label">{field.label}</span>
                <RecapValue field={field} value={field.value} />
              </div>
            ))}
            {hasGoals && (
              <div className="giq-recap-item giq-recap-item--full">
                <span className="giq-recap-label">Goals &amp; context</span>
                <RecapGoals assessment={assessment} />
              </div>
            )}
          </div>
          {presenceRows.length > 0 && (
            <div className="giq-recap-presence">
              <h3>Digital presence checklist</h3>
              <ul>
                {presenceRows.map((row) => (
                  <li key={row.label}>
                    <strong>{row.label}:</strong> {row.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
