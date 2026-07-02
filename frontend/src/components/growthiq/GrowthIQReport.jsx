import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Download, TrendingUp, AlertTriangle, Target, Zap, Map, ChevronDown, ChevronUp,
} from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import AssessmentRecap from './AssessmentRecap';
import { downloadGrowthIQPdf } from '../../lib/growthiqPdf';
import { GROWTHIQ_BRAND } from '../../data/growthiqConstants';

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) {
      setValue(0);
      return undefined;
    }
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

function ScoreRing({ score, size = 140 }) {
  const animatedScore = useCountUp(score);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
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
        <span className="giq-score-num">{animatedScore}</span>
        <span className="giq-score-of">/ 100</span>
      </div>
    </div>
  );
}

function AnimatedScoreBar({ score }) {
  const animatedScore = useCountUp(score, 900);
  return (
    <div className="giq-cat-score-bar" aria-hidden="true">
      <motion.div
        className="giq-cat-score-fill"
        initial={{ width: 0 }}
        animate={{ width: `${animatedScore}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function CategoryCard({ cat, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const priorityClass = (cat.priority_level || '').toLowerCase();
  const displayScore = useCountUp(cat.score || 0, 900);
  const scoreLabel = cat.score_label || '';

  return (
    <div className={`giq-cat-card${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="giq-cat-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="giq-cat-left">
          <span className="giq-cat-label">{cat.label}</span>
          {scoreLabel && (
            <span className={`giq-score-badge giq-score-badge--${scoreLabel.toLowerCase().replace(/\s+/g, '-')}`}>
              {scoreLabel}
            </span>
          )}
          <span className={`giq-priority giq-priority--${priorityClass}`}>{cat.priority_level}</span>
        </div>
        <div className="giq-cat-right">
          <AnimatedScoreBar score={cat.score || 0} />
          <span className="giq-cat-score">{displayScore}</span>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="giq-cat-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {cat.finding && (
              <div className="giq-cat-finding">
                <strong>Finding</strong>
                <p>{cat.finding}</p>
              </div>
            )}
            {!cat.finding && cat.explanation && (
              <p className="giq-cat-explanation">{cat.explanation}</p>
            )}
            {cat.recommendation && (
              <div className="giq-cat-section">
                <strong>Recommendation</strong>
                <p className="giq-cat-rec-text">{cat.recommendation}</p>
              </div>
            )}
            {cat.weroi_help && (
              <p className="giq-cat-weroi-help">{cat.weroi_help}</p>
            )}
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
            {cat.recommendations?.length > 1 && (
              <div className="giq-cat-section">
                <strong>Additional steps</strong>
                <ul>{cat.recommendations.map((r) => <li key={r}>{r}</li>)}</ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
  const summary = r.report_summary || {};

  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDownload = async () => {
    setPdfLoading(true);
    try {
      await downloadGrowthIQPdf({ report: r, assessment, reportId });
    } finally {
      setPdfLoading(false);
    }
  };

  const ctaHeadline = (r.overall_score || 0) >= 85
    ? 'Want a second opinion on your next-level opportunities?'
    : 'Imagine what we could uncover with a full expert review.';

  return (
    <div className="giq-report">
      <section className="giq-report-hero">
        <span className="giq-eyebrow">{GROWTHIQ_BRAND} Report</span>
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
          Scores reflect self-reported data and analysis from your answers
          {r.website_analysis_used ? ' plus live website signals' : ''}.
        </p>
      </section>

      <AssessmentRecap assessment={assessment} />

      {(summary.overall_meaning || summary.priority_areas?.length > 0) && (
        <section className="giq-report-section giq-report-summary-card">
          <h2>Your Score at a Glance</h2>
          {summary.overall_meaning && (
            <p className="giq-summary-text">{summary.overall_meaning}</p>
          )}
          {summary.priority_areas?.length > 0 && (
            <div className="giq-priority-areas">
              <h3>Top Priority Areas</h3>
              <ul>
                {summary.priority_areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>
          )}
          {summary.expert_review_invite && (
            <p className="giq-expert-invite">{summary.expert_review_invite}</p>
          )}
        </section>
      )}

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
            <motion.div
              className="giq-confidence-fill"
              initial={{ width: 0 }}
              animate={{ width: `${r.confidence_score}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="giq-confidence-label">
            {r.confidence_score}% confidence based on data provided
            {r.website_analysis_used ? ' and live website analysis' : ''}
          </p>
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
        <p className="giq-cat-hint">Tap a category to expand details.</p>
        <div className="giq-cat-list">
          {(r.categories || []).map((cat) => (
            <CategoryCard key={cat.key || cat.label} cat={cat} defaultOpen={false} />
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
        <h2>{ctaHeadline}</h2>
        <p>
          Your {GROWTHIQ_BRAND} report is a strong starting point. If you would like us to go deeper,
          request a complimentary expert review. The weROI team will personally validate your assessment,
          identify additional opportunities, and show you what partnering with weROI could look like
          for your business, including strategic recommendations and, when appropriate, visual
          concepts or website mockups to illustrate the path forward. These are provided at our
          discretion and are not guaranteed with every review.
        </p>
        <div className="giq-cta-actions">
          <GlowButton
            size="lg"
            onClick={onRequestReview}
            disabled={reviewLoading}
            className="giq-cta-primary"
          >
            {reviewLoading ? 'Submitting...' : 'Get My Free Expert Growth Review'}
            {!reviewLoading && <ArrowRight size={18} />}
          </GlowButton>
          <button type="button" className="giq-cta-secondary" onClick={onMaybeLater} disabled={reviewLoading}>
            Maybe Later
          </button>
          <button type="button" className="giq-cta-download" onClick={handleDownload} disabled={pdfLoading}>
            <Download size={16} /> {pdfLoading ? 'Building PDF…' : 'Download PDF Report'}
          </button>
        </div>
        <p className="giq-cta-micro">
          Requesting a review shares your assessment with our team. Maybe later saves your report with no follow-up.
        </p>
      </section>
    </div>
  );
}
