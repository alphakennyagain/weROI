import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { DIGITAL_PRESENCE_FIELDS } from '../../data/growthiqConstants';

const LABELS = {
  full_name: 'Full name',
  business_name: 'Business name',
  business_email: 'Email',
  phone: 'Phone',
  country: 'Country',
  preferred_contact: 'Preferred contact',
  industry: 'Industry',
  business_size: 'Team size',
  years_in_business: 'Years in business',
  primary_goal: 'Primary goal',
  website: 'Website',
  website_url: 'Website URL',
  social_links: 'Social links',
  google_business_profile: 'Google Business Profile',
  business_goals: 'Goals & context',
};

export default function AssessmentRecap({ assessment }) {
  const [open, setOpen] = useState(true);
  if (!assessment) return null;

  const presence = assessment.digital_presence || {};
  const presenceRows = DIGITAL_PRESENCE_FIELDS.map((f) => ({
    label: f.label,
    value: presence[f.key],
  })).filter((row) => row.value);

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
            {Object.entries(LABELS).map(([key, label]) => {
              const value = assessment[key];
              if (!value) return null;
              return (
                <div key={key} className="giq-recap-item">
                  <span className="giq-recap-label">{label}</span>
                  <span className="giq-recap-value">{value}</span>
                </div>
              );
            })}
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
