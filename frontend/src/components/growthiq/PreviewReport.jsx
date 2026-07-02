import React from 'react';

const SAMPLE_CATEGORIES = [
  { label: 'Website Experience', score: 78 },
  { label: 'SEO Potential', score: 82 },
  { label: 'Brand & Trust', score: 88 },
  { label: 'Lead Generation', score: 75 },
  { label: 'Digital Presence', score: 86 },
  { label: 'Automation Readiness', score: 70 },
];

export default function PreviewReport() {
  return (
    <div className="giq-preview-report-wrap">
      <div className="giq-preview-report" aria-hidden="true">
        <div className="giq-preview-header">
          <span className="giq-preview-eyebrow">GrowthIQ™ Report</span>
          <div className="giq-preview-score-row">
            <div className="giq-preview-score">
              <span className="giq-preview-score-num">84</span>
              <span className="giq-preview-score-label">Growth Score</span>
            </div>
            <div className="giq-preview-grade">
              <span className="giq-preview-grade-letter">A-</span>
              <span className="giq-preview-grade-level">Established</span>
            </div>
          </div>
        </div>
        <div className="giq-preview-cats">
          {SAMPLE_CATEGORIES.map((cat) => (
            <div key={cat.label} className="giq-preview-cat">
              <span>{cat.label}</span>
              <div className="giq-preview-cat-bar">
                <div className="giq-preview-cat-fill" style={{ width: `${cat.score}%` }} />
              </div>
              <span className="giq-preview-cat-score">{cat.score}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="giq-preview-caption">Example Report</p>
    </div>
  );
}
