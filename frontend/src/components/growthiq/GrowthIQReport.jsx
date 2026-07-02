import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Download, TrendingUp, AlertTriangle, Target, Zap, Map, ChevronDown, ChevronUp,
} from 'lucide-react';
import GlowButton from '../ui/GlowButton';

function ScoreRing({ score, size = 140 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? 'var(--lime)' : score >= 50 ? '#f5a623' : '#e85d4c';

  return (
    <div className="giq-score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(32,32,32,0.08)" strokeWidth="8" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="giq-score-ring-label">
        <span className="giq-score-num">{score}</span>
        <span className="giq-score-of">/ 100</span>
      </div>
    </div>
  );
}

function CategoryCard({ cat }) {
  const [open, setOpen] = useState(false);
  const priorityClass = (cat.priority_level || '').toLowerCase();

  return (
    <div className="giq-cat-card">
      <button type="button" className="giq-cat-header" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div className="giq-cat-left">
          <span className="giq-cat-label">{cat.label}</span>
          <span className={`giq-priority giq-priority--${priorityClass}`}>{cat.priority_level}</span>
        </div>
        <div className="giq-cat-right">
          <div className="giq-cat-score-bar">
            <div className="giq-cat-score-fill" style={{ width: `${cat.score}%` }} />
          </div>
          <span className="giq-cat-score">{cat.score}</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {open && (
        <motion.div
          className="giq-cat-body"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <p className="giq-cat-explanation">{cat.explanation}</p>
          {cat.strengths?.length > 0 && (
            <div className="giq-cat-section">
              <strong>Strengths</strong>
              <ul>{cat.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          )}
          {cat.weaknesses?.length > 0 && (
            <div className="giq-cat-section">
              <strong>Areas to improve</strong>
              <ul>{cat.weaknesses.map((w) => <li key={w}>{w}</li>)}</ul>
            </div>
          )}
          {cat.recommendations?.length > 0 && (
            <div className="giq-cat-section">
              <strong>Recommendations</strong>
              <ul>{cat.recommendations.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function GrowthIQReport({
  report,
  assessment,
  reportId,
  onRequestReview,
  onMaybeLater,
  reviewLoading,
}) {
  const r = report || {};
  const business = assessment?.business_name || 'Your Business';

  const handleDownload = () => {
    const content = JSON.stringify({ report_id: reportId, business, report: r, assessment }, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GrowthIQ-Report-${reportId.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="giq-report">
      <section className="giq-report-hero">
        <span className="giq-eyebrow">GrowthIQ™ Report</span>
        <h1 className="giq-report-title">{business}</h1>
        <p className="giq-report-id">Report ID: {reportId}</p>

        <div className="giq-report-score-block">
          <ScoreRing score={r.overall_score || 0} />
          <div className="giq-report-grade">
            <span className="giq-grade-letter">{r.letter_grade}</span>
            <span className="giq-grade-level">{r.growth_level}</span>
            <p className="giq-grade-desc">Growth Level</p>
          </div>
        </div>

        <p className="giq-disclaimer">
          Based on the information provided. This assessment is not a guarantee of results.
          Scores reflect self-reported data and AI analysis.
        </p>
      </section>

      {r.business_summary && (
        <section className="giq-report-section">
          <h2>Business Summary</h2>
          <p className="giq-summary-text">{r.business_summary}</p>
        </section>
      )}

      {typeof r.confidence_score === 'number' && (
        <section className="giq-report-section giq-confidence">
          <h2>Report Confidence</h2>
          <div className="giq-confidence-bar">
            <div className="giq-confidence-fill" style={{ width: `${r.confidence_score}%` }} />
          </div>
          <p className="giq-confidence-label">{r.confidence_score}% confidence based on data provided{r.website_analysis_used ? ' and live website analysis' : ''}</p>
        </section>
      )}

      <section className="giq-report-section">
        <h2><TrendingUp size={20} /> Executive Summary</h2>
        <p className="giq-summary-text">{r.executive_summary}</p>
        {r.top_next_actions?.length > 0 && (
          <div className="giq-actions-card">
            <h3>Top 3 Next Actions</h3>
            <ol>
              {r.top_next_actions.map((a) => <li key={a}>{a}</li>)}
            </ol>
          </div>
        )}
      </section>

      <section className="giq-report-section">
        <h2>Category Breakdown</h2>
        <div className="giq-cat-list">
          {(r.categories || []).map((cat) => (
            <CategoryCard key={cat.key || cat.label} cat={cat} />
          ))}
        </div>
      </section>

      <section className="giq-report-section giq-report-grid">
        <div className="giq-report-card">
          <h3><Target size={18} /> Top Opportunities</h3>
          <ul>{(r.top_opportunities || []).map((o) => <li key={o}>{o}</li>)}</ul>
        </div>
        <div className="giq-report-card">
          <h3><Zap size={18} /> Quick Wins</h3>
          <ul>{(r.quick_wins || []).map((w) => <li key={w}>{w}</li>)}</ul>
        </div>
        <div className="giq-report-card">
          <h3><TrendingUp size={18} /> Long-Term Opportunities</h3>
          <ul>{(r.long_term_opportunities || []).map((l) => <li key={l}>{l}</li>)}</ul>
        </div>
        <div className="giq-report-card giq-report-card--warn">
          <h3><AlertTriangle size={18} /> Potential Risks</h3>
          <ul>{(r.potential_risks || []).map((risk) => <li key={risk}>{risk}</li>)}</ul>
        </div>
      </section>

      <section className="giq-report-section">
        <h2>Investment Priorities</h2>
        <div className="giq-priority-tags">
          {(r.investment_priorities || []).map((p) => (
            <span key={p} className="giq-priority-tag">{p}</span>
          ))}
        </div>
      </section>

      {(r.suggested_roadmap || []).length > 0 && (
        <section className="giq-report-section">
          <h2><Map size={20} /> Suggested Roadmap</h2>
          <div className="giq-roadmap">
            {r.suggested_roadmap.map((phase) => (
              <div key={phase.phase} className="giq-roadmap-phase">
                <span className="giq-roadmap-time">{phase.phase}</span>
                <h4>{phase.focus}</h4>
                <ul>{(phase.actions || []).map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {r.estimated_growth_impact && (
        <section className="giq-report-section giq-impact">
          <h2>Estimated Growth Impact</h2>
          <p>{r.estimated_growth_impact}</p>
        </section>
      )}

      {(r.potential_impact_areas || []).length > 0 && (
        <section className="giq-report-section">
          <h2>Potential Impact Areas</h2>
          <div className="giq-priority-tags">
            {r.potential_impact_areas.map((area) => (
              <span key={area} className="giq-priority-tag">{area}</span>
            ))}
          </div>
        </section>
      )}

      <section className="giq-report-cta" id="giq-expert-review">
        <h2>Would you like a complimentary expert review from weROI?</h2>
        <p>
          Your GrowthIQ™ report is a starting point based on your answers
          {r.website_analysis_used ? ' and verified website signals' : ''}.
          Our team can validate findings against your live digital presence and build a custom growth plan.
          Expert reviews are offered at our discretion for a limited number of businesses each week.
          There is no obligation and no guarantee of specific outcomes.
        </p>
        <div className="giq-cta-actions">
          <GlowButton
            size="lg"
            onClick={onRequestReview}
            disabled={reviewLoading}
            className="giq-cta-primary"
          >
            {reviewLoading ? 'Submitting...' : 'Request Expert Review'}
            {!reviewLoading && <ArrowRight size={18} />}
          </GlowButton>
          <button type="button" className="giq-cta-secondary" onClick={onMaybeLater} disabled={reviewLoading}>
            Maybe Later
          </button>
          <button type="button" className="giq-cta-download" onClick={handleDownload}>
            <Download size={16} /> Download Report
          </button>
        </div>
        <p className="giq-cta-micro">
          Requesting a review shares your assessment with our team. Maybe later saves your report with no follow-up.
        </p>
      </section>
    </div>
  );
}
