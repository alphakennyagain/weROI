import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import SiteHeader from './SiteHeader';
import GlowButton from './ui/GlowButton';
import GrowthIQWizard from './growthiq/GrowthIQWizard';
import GrowthIQProcessing from './growthiq/GrowthIQProcessing';
import GrowthIQReport from './growthiq/GrowthIQReport';
import PreviewReport from './growthiq/PreviewReport';
import {
  HOW_IT_WORKS,
  PREMIUM_CARDS,
  HERO_CHECKMARKS,
  hasDraft,
  clearDraft,
} from '../data/growthiqConstants';
import './GrowthIQ.css';

const API_URL = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '');

const PHASE = {
  LANDING: 'landing',
  FORM: 'form',
  PROCESSING: 'processing',
  REPORT: 'report',
  THANKS: 'thanks',
};

export default function GrowthPreview() {
  const [phase, setPhase] = useState(PHASE.LANDING);
  const [assessmentData, setAssessmentData] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [expertRequested, setExpertRequested] = useState(false);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [resumeWizard, setResumeWizard] = useState(false);

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

  useEffect(() => {
    window.scrollTo(0, 0);
    track('page_view');
    track('growthiq_landing_view');
    setShowResumeBanner(hasDraft());
  }, [track]);

  const startAssessment = () => {
    track('growthiq_form_start');
    setResumeWizard(false);
    setPhase(PHASE.FORM);
    document.getElementById('giq-assessment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resumeAssessment = () => {
    track('growthiq_form_resume');
    setResumeWizard(true);
    setPhase(PHASE.FORM);
    setShowResumeBanner(false);
    document.getElementById('giq-assessment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormComplete = async (data) => {
    setAssessmentData(data);
    setPhase(PHASE.PROCESSING);
    setError('');

    if (!API_URL) {
      setError('Assessment service is not configured. Please contact growth@weroi.net.');
      setPhase(PHASE.FORM);
      return;
    }

    window.__giqPendingResult = fetch(`${API_URL}/api/growthiq/assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, referrer: document.referrer || null }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = await res.json();
        track('growthiq_report_generated');
        return json;
      })
      .catch(() => {
        setError('We could not generate your report. Please try again or email growth@weroi.net.');
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
        setResult(json);
        setPhase(PHASE.REPORT);
        setShowResumeBanner(false);
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
        <SiteHeader
          className="giq-header"
          hideLogo
          showCenterLinks={false}
          showDesktopCta={false}
          desktopActions={
            <Link to="/" className="giq-back"><ArrowLeft size={14} /> Home</Link>
          }
        />
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
              ? 'Our team will review your GrowthIQ™ assessment and reach out within 48 hours.'
              : 'Your GrowthIQ™ report has been saved. You can return anytime to request a complimentary expert review.'}
          </p>
          {result?.report_id && (
            <p className="giq-report-id">Report ID: {result.report_id}</p>
          )}
          <GlowButton onClick={() => window.location.href = '/'} size="lg">
            Back to weROI <ArrowRight size={16} />
          </GlowButton>
        </div>
      </div>
    );
  }

  return (
    <div className="giq-page" data-testid="growth-preview-page">
      <SiteHeader
        className="giq-header"
        hideLogo
        showCenterLinks={false}
        showDesktopCta={false}
        ctaLabel="Free Assessment"
        desktopActions={
          <Link to="/" className="giq-back"><ArrowLeft size={14} /> Home</Link>
        }
      />

      {showResumeBanner && phase === PHASE.LANDING && (
        <div className="giq-resume-banner">
          <div className="container giq-resume-inner">
            <p>You have a saved assessment in progress.</p>
            <div className="giq-resume-actions">
              <GlowButton size="sm" onClick={resumeAssessment}>Resume Assessment</GlowButton>
              <button type="button" className="giq-text-btn" onClick={() => { clearDraft(); setShowResumeBanner(false); }}>Start Over</button>
            </div>
          </div>
        </div>
      )}

      <section className="giq-hero">
        <div className="container">
          <motion.span
            className="giq-eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            weROI Growth Preview · GrowthIQ™
          </motion.span>
          <motion.h1
            className="giq-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            What&apos;s Your Business&apos;s GrowthIQ Score?
          </motion.h1>
          <motion.p
            className="giq-hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Most business owners do not realize where they are losing customers online. In under 5 minutes,
            get a personalized GrowthIQ™ report that reveals your biggest opportunities, with no obligation.
          </motion.p>
          {phase === PHASE.LANDING && (
            <motion.div
              className="giq-hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlowButton size="lg" onClick={startAssessment} data-testid="giq-hero-cta">
                Get My Free Assessment <ArrowRight size={18} />
              </GlowButton>
              <ul className="giq-hero-checkmarks">
                {HERO_CHECKMARKS.map((item) => (
                  <li key={item}><Check size={14} /> {item}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </section>

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
          <h2 className="giq-section-title">What&apos;s Included in Your GrowthIQ™ Report</h2>
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

      {(phase === PHASE.FORM || phase === PHASE.LANDING) && (
        <section className="giq-section giq-form-section">
          <div className="container giq-form-container">
            {phase === PHASE.LANDING && (
              <div className="giq-form-intro">
                <PreviewReport />
                <p className="giq-exclusivity">
                  Every GrowthIQ™ Assessment is personalized for your business. To ensure quality,
                  our expert reviews are completed for a limited number of businesses each week.
                </p>
                <h2>Ready to see your growth score?</h2>
                <p>Complete the assessment below or tap the button above to begin.</p>
                <GlowButton onClick={startAssessment} size="lg">
                  Start My Assessment <ArrowRight size={16} />
                </GlowButton>
              </div>
            )}
            {phase === PHASE.FORM && (
              <>
                {error && <p className="giq-error giq-error--center" role="alert">{error}</p>}
                <GrowthIQWizard onComplete={handleFormComplete} initialResume={resumeWizard} />
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
