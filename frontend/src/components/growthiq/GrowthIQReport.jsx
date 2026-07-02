import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Download,
  TrendingUp,
  AlertTriangle,
  Target,
  Zap,
  Map,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  CheckSquare,
  Eye,
  Globe,
  Check,
  Circle,
} from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import AssessmentRecap from './AssessmentRecap';
import { downloadGrowthIQPdf } from '../../lib/growthiqPdf';
import { GROWTHIQ_BRAND } from '../../data/growthiqConstants';
import {
  getLiveSiteSummary,
  getPersonalizedInsights,
  getReportSnapshot,
  getVisibilityProfile,
  loadChecklist,
  saveChecklist,
} from '../../lib/growthiqReportUtils';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'gaps', label: 'Your Gaps', icon: Eye },
  { id: 'actions', label: 'Action Plan', icon: CheckSquare },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
];

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All areas' },
  { id: 'priority', label: 'Priority only' },
  { id: 'attention', label: 'Needs attention' },
];

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
                <strong>What we found for you</strong>
                <p>{cat.finding}</p>
              </div>
            )}
            {!cat.finding && cat.explanation && (
              <p className="giq-cat-explanation">{cat.explanation}</p>
            )}
            {cat.recommendation && (
              <div className="giq-cat-section">
                <strong>Your next step</strong>
                <p className="giq-cat-rec-text">{cat.recommendation}</p>
              </div>
            )}
            {cat.weroi_help && (
              <p className="giq-cat-weroi-help">{cat.weroi_help}</p>
            )}
            {cat.strengths?.length > 0 && (
              <div className="giq-cat-section">
                <strong>What is working</strong>
                <ul>{cat.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            )}
            {cat.weaknesses?.length > 0 && (
              <div className="giq-cat-section">
                <strong>What may be hiding you</strong>
                <ul>{cat.weaknesses.map((w) => <li key={w}>{w}</li>)}</ul>
              </div>
            )}
            {cat.recommendations?.length > 1 && (
              <div className="giq-cat-section">
                <strong>Additional steps</strong>
                <ul>{cat.recommendations.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InteractiveChecklist({ items, reportId }) {
  const [checked, setChecked] = useState(() => loadChecklist(reportId));

  const toggle = (item) => {
    const next = { ...checked, [item]: !checked[item] };
    setChecked(next);
    saveChecklist(reportId, next);
  };

  const doneCount = items.filter((item) => checked[item]).length;

  return (
    <div className="giq-checklist">
      <div className="giq-checklist-progress">
        <span>{doneCount} of {items.length} completed</span>
        <div className="giq-checklist-bar">
          <motion.div
            className="giq-checklist-bar-fill"
            animate={{ width: `${items.length ? (doneCount / items.length) * 100 : 0}%` }}
          />
        </div>
      </div>
      <ul className="giq-checklist-list">
        {items.map((item) => (
          <li key={item} className={checked[item] ? 'is-done' : ''}>
            <button type="button" onClick={() => toggle(item)} aria-pressed={!!checked[item]}>
              {checked[item] ? <Check size={16} /> : <Circle size={16} />}
              <span>{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightCards({ insights }) {
  const [expanded, setExpanded] = useState(0);
  if (!insights?.length) return null;

  return (
    <div className="giq-insight-cards">
      {insights.map((text, i) => (
        <button
          key={text.slice(0, 40)}
          type="button"
          className={`giq-insight-card${expanded === i ? ' is-active' : ''}`}
          onClick={() => setExpanded(expanded === i ? -1 : i)}
          aria-expanded={expanded === i}
        >
          <span className="giq-insight-num">{String(i + 1).padStart(2, '0')}</span>
          <p>{expanded === i ? text : `${text.slice(0, 120)}${text.length > 120 ? '...' : ''}`}</p>
        </button>
      ))}
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
  const websiteAnalysis = assessment?.website_analysis;

  const snapshot = useMemo(() => getReportSnapshot(r, assessment), [r, assessment]);
  const visibility = useMemo(
    () => getVisibilityProfile(r, assessment, websiteAnalysis),
    [r, assessment, websiteAnalysis],
  );
  const insights = useMemo(
    () => getPersonalizedInsights(r, assessment, websiteAnalysis),
    [r, assessment, websiteAnalysis],
  );
  const liveSite = useMemo(
    () => getLiveSiteSummary(r, websiteAnalysis),
    [r, websiteAnalysis],
  );

  const [activeTab, setActiveTab] = useState('overview');
  const [catFilter, setCatFilter] = useState('all');
  const [pdfLoading, setPdfLoading] = useState(false);

  const categories = useMemo(() => {
    const all = r.categories || [];
    if (catFilter === 'priority') {
      return all.filter((c) => (c.score || 0) < 60 || (c.priority_level || '').toLowerCase() === 'high');
    }
    if (catFilter === 'attention') {
      return all.filter((c) => (c.score || 0) < 85);
    }
    return all;
  }, [r.categories, catFilter]);

  const lowestCats = useMemo(
    () => [...(r.categories || [])].sort((a, b) => (a.score || 0) - (b.score || 0)).slice(0, 3),
    [r.categories],
  );

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

  const scrollToTab = (id) => {
    setActiveTab(id);
    document.getElementById(`giq-tab-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="giq-report giq-report--interactive">
      <section className="giq-report-hero">
        <span className="giq-eyebrow">{GROWTHIQ_BRAND} Report</span>
        <h1 className="giq-report-title">{business}</h1>
        <p className="giq-report-id">Report ID: {reportId}</p>
        <p className="giq-report-save-notice">
          We emailed this Report ID to <strong>{assessment?.business_email}</strong>.
          Save the ID or download the PDF below. You need the ID and your email to open this report again.
        </p>

        <div className="giq-report-score-block">
          <ScoreRing score={r.overall_score || 0} />
          <div className="giq-report-grade">
            <span className="giq-grade-letter">{r.letter_grade}</span>
            <span className="giq-grade-level">{r.growth_level}</span>
            <p className="giq-grade-desc">Your {GROWTHIQ_BRAND} Score</p>
          </div>
        </div>

        <p className="giq-disclaimer">
          Based on your answers for {snapshot.industry} in {snapshot.country}.
          {r.website_analysis_used ? ' Includes live website signals.' : ''}
          {' '}This is guidance, not a guarantee of results.
        </p>
      </section>

      <nav className="giq-report-nav" aria-label="Report sections">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={`giq-report-nav-btn${activeTab === tab.id ? ' is-active' : ''}`}
              onClick={() => scrollToTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div id="giq-tab-overview" className="giq-report-panel">
        <section className="giq-report-section giq-snapshot-card">
          <h2>Your business at a glance</h2>
          <div className="giq-snapshot-chips">
            <span className="giq-snapshot-chip"><strong>Industry</strong> {snapshot.industry}</span>
            <span className="giq-snapshot-chip"><strong>Market</strong> {snapshot.country}</span>
            <span className="giq-snapshot-chip"><strong>Team</strong> {snapshot.team_size}</span>
            <span className="giq-snapshot-chip"><strong>Goal</strong> {snapshot.primary_goal}</span>
            <span className="giq-snapshot-chip"><strong>Website</strong> {snapshot.website_status}</span>
          </div>
          {snapshot.website_url && (
            <p className="giq-snapshot-url">
              <Globe size={14} /> {snapshot.website_url}
            </p>
          )}
        </section>

        <section className="giq-report-section giq-visibility-card">
          <h2><Eye size={20} /> What may be making you invisible</h2>
          <p className="giq-visibility-headline">{visibility.headline}</p>
          <p className="giq-visibility-context">{visibility.primary_goal_context}</p>
          <div className="giq-visibility-meter">
            <span>Online visibility signal</span>
            <div className="giq-visibility-bar">
              <motion.div
                className="giq-visibility-fill"
                initial={{ width: 0 }}
                animate={{ width: `${visibility.visibility_score || r.overall_score || 0}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="giq-visibility-pct">{visibility.visibility_score || r.overall_score || 0}%</span>
          </div>
          <div className="giq-visibility-grid">
            <div className="giq-visibility-col">
              <h3>Gaps to fix</h3>
              <ul>
                {(visibility.invisible_reasons || []).map((item) => (
                  <li key={`${item.area}-${item.detail}`} className={`giq-visibility-item giq-visibility-item--${item.severity}`}>
                    <strong>{item.area}</strong>
                    <p>{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
            {(visibility.visible_strengths || []).length > 0 && (
              <div className="giq-visibility-col giq-visibility-col--good">
                <h3>What is already visible</h3>
                <ul>
                  {visibility.visible_strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <section className="giq-report-section">
          <h2>Insights specific to {business}</h2>
          <InsightCards insights={insights} />
        </section>

        {(summary.overall_meaning || summary.priority_areas?.length > 0) && (
          <section className="giq-report-section giq-report-summary-card">
            <h2>Your score explained</h2>
            {summary.overall_meaning && (
              <p className="giq-summary-text">{summary.overall_meaning}</p>
            )}
            {lowestCats.length > 0 && (
              <div className="giq-priority-areas giq-priority-areas--interactive">
                <h3>Lowest-scoring areas for {business}</h3>
                <div className="giq-mini-cats">
                  {lowestCats.map((cat) => (
                    <button
                      key={cat.key || cat.label}
                      type="button"
                      className="giq-mini-cat"
                      onClick={() => {
                        setActiveTab('gaps');
                        setCatFilter('priority');
                        document.getElementById('giq-tab-gaps')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <span>{cat.label}</span>
                      <strong>{cat.score}/100</strong>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {liveSite && (
          <section className="giq-report-section giq-live-site">
            <h2><Globe size={20} /> Live website findings</h2>
            <p className="giq-live-site-url">{liveSite.url}</p>
            <div className="giq-live-site-grid">
              {liveSite.page_title && (
                <div><strong>Page title</strong><p>{liveSite.page_title}</p></div>
              )}
              {liveSite.h1_headings?.[0] && (
                <div><strong>Main headline</strong><p>{liveSite.h1_headings[0]}</p></div>
              )}
              {liveSite.cta_texts?.length > 0 && (
                <div><strong>CTAs detected</strong><p>{liveSite.cta_texts.slice(0, 4).join(' · ')}</p></div>
              )}
            </div>
            {liveSite.is_spa_shell && (
              <p className="giq-live-site-note">JavaScript app detected. Some elements load after the page opens, so static analysis may be partial.</p>
            )}
            {liveSite.issues?.length > 0 && (
              <div className="giq-live-site-issues">
                <strong>Issues flagged on your site</strong>
                <ul>{liveSite.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
              </div>
            )}
          </section>
        )}

        <section className="giq-report-section">
          <h2><TrendingUp size={20} /> Executive summary</h2>
          <p className="giq-summary-text">{r.executive_summary}</p>
          {r.business_summary && (
            <p className="giq-summary-text giq-summary-text--muted">{r.business_summary}</p>
          )}
          {r.top_next_actions?.length > 0 && (
            <div className="giq-actions-card">
              <h3>Top 3 actions for {business}</h3>
              <ol>
                {r.top_next_actions.map((a) => <li key={a}>{a}</li>)}
              </ol>
            </div>
          )}
        </section>
      </div>

      <div id="giq-tab-gaps" className="giq-report-panel">
        <section className="giq-report-section">
          <div className="giq-section-head">
            <h2>Category breakdown</h2>
            <div className="giq-filter-pills" role="tablist" aria-label="Filter categories">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={catFilter === f.id}
                  className={`giq-filter-pill${catFilter === f.id ? ' is-active' : ''}`}
                  onClick={() => setCatFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <p className="giq-cat-hint">Tap any category to see findings written for {business}.</p>
          <div className="giq-cat-list">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.key || cat.label} cat={cat} defaultOpen={i === 0 && catFilter !== 'all'} />
            ))}
            {categories.length === 0 && (
              <p className="giq-cat-empty">No categories match this filter.</p>
            )}
          </div>
        </section>

        {typeof r.confidence_score === 'number' && (
          <section className="giq-report-section giq-confidence">
            <h2>Report confidence</h2>
            <div className="giq-confidence-bar">
              <motion.div
                className="giq-confidence-fill"
                initial={{ width: 0 }}
                animate={{ width: `${r.confidence_score}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="giq-confidence-label">
              {r.confidence_score}% confidence based on your answers
              {r.website_analysis_used ? ' and live website analysis' : ''}
            </p>
          </section>
        )}
      </div>

      <div id="giq-tab-actions" className="giq-report-panel">
        <section className="giq-report-section">
          <h2><Zap size={20} /> Your quick wins checklist</h2>
          <p className="giq-cat-hint">Check items off as you complete them. Progress saves on this device.</p>
          <InteractiveChecklist items={r.quick_wins || []} reportId={reportId} />
        </section>

        <section className="giq-report-section giq-report-grid">
          <div className="giq-report-card">
            <h3><Target size={18} /> Top opportunities for {business}</h3>
            <ul>{(r.top_opportunities || []).map((o) => <li key={o}>{o}</li>)}</ul>
          </div>
          <div className="giq-report-card giq-report-card--warn">
            <h3><AlertTriangle size={18} /> Risks if unchanged</h3>
            <ul>{(r.potential_risks || []).map((risk) => <li key={risk}>{risk}</li>)}</ul>
          </div>
          <div className="giq-report-card">
            <h3><TrendingUp size={18} /> Long-term plays</h3>
            <ul>{(r.long_term_opportunities || []).map((l) => <li key={l}>{l}</li>)}</ul>
          </div>
        </section>

        <section className="giq-report-section">
          <h2>Where to invest first</h2>
          <div className="giq-priority-tags">
            {(r.investment_priorities || []).map((p) => (
              <span key={p} className="giq-priority-tag">{p}</span>
            ))}
          </div>
        </section>

        {r.estimated_growth_impact && (
          <section className="giq-report-section giq-impact">
            <h2>Estimated growth impact</h2>
            <p>{r.estimated_growth_impact}</p>
          </section>
        )}
      </div>

      <div id="giq-tab-roadmap" className="giq-report-panel">
        {(r.suggested_roadmap || []).length > 0 && (
          <section className="giq-report-section">
            <h2><Map size={20} /> Your 30 / 60 / 90 day roadmap</h2>
            <p className="giq-cat-hint">Tailored to {snapshot.primary_goal.toLowerCase()} for a {snapshot.industry} business.</p>
            <div className="giq-roadmap">
              {r.suggested_roadmap.map((phase, i) => (
                <RoadmapPhase key={phase.phase} phase={phase} defaultOpen={i === 0} />
              ))}
            </div>
          </section>
        )}

        {(r.potential_impact_areas || []).length > 0 && (
          <section className="giq-report-section">
            <h2>Potential impact areas</h2>
            <div className="giq-priority-tags">
              {r.potential_impact_areas.map((area) => (
                <span key={area} className="giq-priority-tag">{area}</span>
              ))}
            </div>
          </section>
        )}
      </div>

      <AssessmentRecap assessment={assessment} />

      <section className="giq-report-cta" id="giq-expert-review">
        <h2>{ctaHeadline}</h2>
        <p>
          Your {GROWTHIQ_BRAND} report is built from {business}&apos;s answers
          {r.website_analysis_used ? ' and a live look at your website' : ''}.
          Request a complimentary expert review and our team will validate these findings,
          prioritize what matters most for {snapshot.primary_goal.toLowerCase()},
          and outline what partnering with weROI could look like.
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

function RoadmapPhase({ phase, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`giq-roadmap-phase giq-roadmap-phase--interactive${open ? ' is-open' : ''}`}>
      <button type="button" className="giq-roadmap-phase-header" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="giq-roadmap-time">{phase.phase}</span>
        <h4>{phase.focus}</h4>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="giq-roadmap-phase-body"
          >
            <ul>{(phase.actions || []).map((a) => <li key={a}>{a}</li>)}</ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
