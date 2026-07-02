import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Sparkles, Check, Target, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import GrowthIQNav from './growthiq/GrowthIQNav';
import GlowButton from './ui/GlowButton';
import GrowthIQWizard from './growthiq/GrowthIQWizard';
import GrowthIQProcessing from './growthiq/GrowthIQProcessing';
import GrowthIQReport from './growthiq/GrowthIQReport';
import PreviewReport from './growthiq/PreviewReport';
import MyReports from './growthiq/MyReports';
import {
  HOW_IT_WORKS,
  PREMIUM_CARDS,
  HERO_CHECKMARKS,
  HERO_PROOF_STAT,
  CTA_TIME_NOTE,
  GROWTHIQ_BRAND,
  WHAT_IS_GROWTHIQ,
  hasDraft,
  clearDraft,
  saveReportToLibrary,
} from '../data/growthiqConstants';
import { getBackendUrl } from '../lib/apiConfig';
import './GrowthIQ.css';

const API_URL = getBackendUrl();

const PAGE_TITLE = 'Free Business Growth Assessment | weROI GrowthIQ™ Jamaica';
const PAGE_DESCRIPTION =
  'Get your free weROI GrowthIQ™ score in minutes. A personalized review of your business, website, and growth gaps, built by a Jamaican digital agency, not a generic AI template.';
const CANONICAL = 'https://weroi.net/growth-preview';
const DEFAULT_TITLE = 'weROI | Digital Growth Agency in Jamaica';
const DEFAULT_DESCRIPTION =
  'weROI is a Jamaican digital growth agency. We build websites, SEO, custom software, marketing funnels, CRM, automation, and ad systems so local businesses get found on Google and scale with measurable ROI.';

const PHASE = {
  LANDING: 'landing',
  FORM: 'form',
  PROCESSING: 'processing',
  REPORT: 'report',
  THANKS: 'thanks',
};

const showMarketing = (phase) => phase === PHASE.LANDING || phase === PHASE.FORM;

export default function GrowthPreview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [phase, setPhase] = useState(() => (hasDraft() ? PHASE.FORM : PHASE.LANDING));
  const [assessmentData, setAssessmentData] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [expertRequested, setExpertRequested] = useState(false);
  const [reportLoadError, setReportLoadError] = useState('');

  const sid = (() => {
    const e = sessionStorage.getItem('sessionId');
    if (e) return e;
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', id);
    return id;
  })();

  const track = useCallback((event_type) => {
    if (!API_URL) return;
    fetch(`${API_URL}/api/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type,
        page: '/growth-preview',
        referrer: document.referrer || null,
        session_id: sid,
      }),
    }).catch(() => {});
  }, [sid]);

  const loadReport = useCallback(async (reportId, email) => {
    if (!reportId || !email) return;
    if (!API_URL) {
      setReportLoadError('We could not reach the report service. Please try again shortly.');
      return;
    }
    setReportLoadError('');
    try {
      const res = await fetch(
        `${API_URL}/api/growthiq/assessment/${encodeURIComponent(reportId)}?email=${encodeURIComponent(email)}`
      );
      if (!res.ok) {
        if (res.status === 403) {
          setReportLoadError('That email does not match this report. Use the email from your assessment.');
        } else {
          setReportLoadError('Report not found. Check your email or complete a new assessment.');
        }
        return;
      }
      const json = await res.json();
      saveReportToLibrary(json);
      setResult(json);
      setExpertRequested(!!json.expert_review_requested);
      setPhase(PHASE.REPORT);
      setSearchParams({}, { replace: true });
      window.scrollTo(0, 0);
      track('growthiq_report_reopened');
    } catch {
      setReportLoadError('Could not load your report. Please try again.');
    }
  }, [setSearchParams, track]);

  useEffect(() => {
    const reportId = searchParams.get('report');
    const email = searchParams.get('email');
    if (reportId && email) {
      loadReport(reportId, email);
    }
  }, [searchParams, loadReport]);

  useEffect(() => {
    document.title = PAGE_TITLE;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', PAGE_DESCRIPTION);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', CANONICAL);

    window.scrollTo(0, 0);
    track('page_view');
    if (hasDraft()) {
      track('growthiq_form_resume');
      requestAnimationFrame(() => {
        document.getElementById('giq-assessment-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      track('growthiq_landing_view');
    }

    return () => {
      document.title = DEFAULT_TITLE;
      const defaultDesc = document.querySelector('meta[name="description"]');
      if (defaultDesc) defaultDesc.setAttribute('content', DEFAULT_DESCRIPTION);
      if (canonical) canonical.setAttribute('href', 'https://weroi.net/');
    };
  }, [track]);

  const startAssessment = () => {
    track('growthiq_form_start');
    setPhase(PHASE.FORM);
    document.getElementById('giq-assessment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormComplete = async (data) => {
    setAssessmentData(data);
    setPhase(PHASE.PROCESSING);
    setError('');

    if (!API_URL) {
      setError('We could not reach the assessment service. Please try again in a moment or email growth@weroi.net.');
      setPhase(PHASE.FORM);
      return;
    }

    window.__giqPendingResult = fetch(`${API_URL}/api/growthiq/assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, referrer: document.referrer || null }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = new Error(`Request failed (${res.status})`);
          err.status = res.status;
          throw err;
        }
        const json = await res.json();
        track('growthiq_report_generated');
        return json;
      })
      .catch((err) => {
        const status = err?.status;
        if (status === 404 || status === 503) {
          setError('Our report service is updating. Please try again in a few minutes or email growth@weroi.net.');
        } else {
          setError('We could not generate your report. Please try again or email growth@weroi.net.');
        }
        setPhase(PHASE.FORM);
        return null;
      });
  };

  const handleProcessingComplete = async () => {
    const pending = window.__giqPendingResult;
    if (pending) {
      const json = await pending;
      delete window.__giqPendingResult;
      if (json) {
        clearDraft();
        saveReportToLibrary(json);
        setResult(json);
        setPhase(PHASE.REPORT);
        window.scrollTo(0, 0);
      }
    }
  };

  const handleRequestReview = async () => {
    if (!result?.report_id) return;
    setReviewLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/growthiq/expert-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_id: result.report_id }),
      });
      if (!res.ok) throw new Error('Failed');
      setExpertRequested(true);
      saveReportToLibrary({ ...result, expert_review_requested: true });
      track('growthiq_expert_review_requested');
      setPhase(PHASE.THANKS);
    } catch {
      setError('Could not submit review request. Please email growth@weroi.net.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleMaybeLater = async () => {
    if (result?.report_id) {
      await fetch(`${API_URL}/api/growthiq/maybe-later`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_id: result.report_id }),
      }).catch(() => {});
      track('growthiq_maybe_later');
    }
    setPhase(PHASE.THANKS);
  };

  if (phase === PHASE.PROCESSING) {
    return (
      <div className="giq-page">
        <GrowthIQProcessing onComplete={handleProcessingComplete} />
      </div>
    );
  }

  if (phase === PHASE.REPORT && result) {
    return (
      <div className="giq-page">
        <GrowthIQNav />
        <GrowthIQReport
          report={result.report}
          assessment={result}
          reportId={result.report_id}
          onRequestReview={handleRequestReview}
          onMaybeLater={handleMaybeLater}
          reviewLoading={reviewLoading}
        />
        {error && <p className="giq-error giq-error--center" role="alert">{error}</p>}
      </div>
    );
  }

  if (phase === PHASE.THANKS) {
    return (
      <div className="giq-page giq-thanks">
        <div className="giq-thanks-inner">
          <Sparkles size={40} className="giq-thanks-icon" />
          <h1>{expertRequested ? 'Expert review requested!' : 'Thank you!'}</h1>
          <p>
            {expertRequested
              ? `Our weROI team will review your ${GROWTHIQ_BRAND} assessment and reach out within 48 hours.`
              : `Your ${GROWTHIQ_BRAND} report has been saved. You can return anytime to request a complimentary expert review from our team.`}
          </p>
          {result?.report_id && (
            <p className="giq-report-id">Report ID: {result.report_id}</p>
          )}
          <div className="giq-thanks-actions">
            {result?.report_id && result?.business_email && (
              <GlowButton
                onClick={() => loadReport(result.report_id, result.business_email)}
                size="lg"
                variant="outline"
              >
                View my report again
              </GlowButton>
            )}
            <GlowButton onClick={() => window.location.href = '/'} size="lg">
              Back to weROI <ArrowRight size={16} />
            </GlowButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="giq-page" data-testid="growth-preview-page">
      <GrowthIQNav />

      <section className="giq-hero">
        <div className="container">
          <motion.span
            className="giq-eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Powered by {GROWTHIQ_BRAND}
          </motion.span>
          <motion.h1
            className="giq-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            What&apos;s Your {GROWTHIQ_BRAND} Score?
          </motion.h1>
          <motion.p
            className="giq-hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Most business owners do not realize where they are losing customers online. In under 5 minutes,
            get a personalized {GROWTHIQ_BRAND} report that reveals your biggest opportunities, with no obligation.
          </motion.p>
          {phase === PHASE.LANDING && (
            <motion.div
              className="giq-hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlowButton size="lg" onClick={startAssessment} data-testid="giq-hero-cta">
                See What&apos;s Holding Me Back <ArrowRight size={18} />
              </GlowButton>
              <p className="giq-hero-proof-stat">{HERO_PROOF_STAT}</p>
              <p className="giq-hero-micro">{CTA_TIME_NOTE} · Your progress saves automatically</p>
              <ul className="giq-hero-checkmarks">
                {HERO_CHECKMARKS.map((item) => (
                  <li key={item}><Check size={14} /> {item}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </section>

      {showMarketing(phase) && (
        <section className="giq-hero-preview">
          <div className="container">
            <PreviewReport />
          </div>
        </section>
      )}

      {showMarketing(phase) && (
        <section className="giq-section giq-explainer">
          <div className="container giq-explainer-inner">
            <h2 className="giq-section-title">{WHAT_IS_GROWTHIQ.title}</h2>
            <div className="giq-explainer-body">
              {WHAT_IS_GROWTHIQ.body.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>
            <ul className="giq-explainer-bullets">
              {WHAT_IS_GROWTHIQ.bullets.map((item) => {
                const Icon = item.icon === 'shield' ? Shield : item.icon === 'target' ? Target : Sparkles;
                return (
                  <li key={item.text}>
                    <Icon size={18} />
                    <span>{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="giq-section">
        <div className="container">
          <h2 className="giq-section-title">How It Works</h2>
          <div className="giq-cards-grid">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                className="giq-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="giq-card-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="giq-section giq-section--alt">
        <div className="container">
          <h2 className="giq-section-title">What&apos;s Included in Your {GROWTHIQ_BRAND} Report</h2>
          <div className="giq-premium-grid">
            {PREMIUM_CARDS.map((card) => (
              <div key={card.title} className="giq-premium-card">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showMarketing(phase) && (
        <>
          <MyReports onViewReport={loadReport} />
          {reportLoadError && (
            <p className="giq-error giq-error--center giq-my-reports-page-error" role="alert">
              {reportLoadError}
            </p>
          )}
        </>
      )}

      {(phase === PHASE.FORM || phase === PHASE.LANDING) && (
        <section className={`giq-section giq-form-section${phase === PHASE.FORM ? ' giq-form-section--active' : ''}`}>
          <div className="container giq-form-container">
            {phase === PHASE.LANDING && (
              <div className="giq-form-intro">
                <p className="giq-exclusivity">
                  Every {GROWTHIQ_BRAND} Assessment is personalized for your business. To ensure quality,
                  our weROI expert reviews are completed for a limited number of businesses each week.
                </p>
                <h2>Ready to find out where you stand?</h2>
                <p>{CTA_TIME_NOTE} · Instant {GROWTHIQ_BRAND} report · No obligation</p>
                <div className="giq-intro-ctas">
                  <GlowButton onClick={startAssessment} size="lg">
                    Show Me My Growth Plan <ArrowRight size={16} />
                  </GlowButton>
                  <p className="giq-intro-cta-note">{CTA_TIME_NOTE} · Your progress saves automatically</p>
                </div>
              </div>
            )}
            {phase === PHASE.FORM && (
              <div className="giq-assessment-wrap">
                <div className="giq-assessment-badge">
                  <Sparkles size={16} />
                  <span>{GROWTHIQ_BRAND} Assessment</span>
                </div>
                {error && <p className="giq-error giq-error--center" role="alert">{error}</p>}
                <GrowthIQWizard onComplete={handleFormComplete} />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
