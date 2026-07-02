import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ArrowRight, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getBackendUrl } from '../lib/apiConfig';
import { TRUST_LINE } from '../data/siteStats';

const API_URL = getBackendUrl();
const AUTO_SHOW_MS = 3000;
const SESSION_KEY = 'exitPopupShown';

const ExitIntentPopup = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const triggeredRef = useRef(false);

  const sid = sessionStorage.getItem('sessionId') || (() => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', id);
    return id;
  })();

  const track = useCallback(async (event_type) => {
    if (!API_URL) return;
    try {
      await fetch(`${API_URL}/api/analytics/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type,
          page: location.pathname || '/',
          referrer: document.referrer || null,
          session_id: sid,
        }),
      });
    } catch {
      /* ignore */
    }
  }, [sid, location.pathname]);

  const show = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, 'true');
    track('popup_shown');
  }, [track]);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      triggeredRef.current = true;
      return undefined;
    }

    const autoTimer = setTimeout(show, AUTO_SHOW_MS);

    const onLeave = (e) => { if (e.clientY <= 0) show(); };
    const onPop = () => { show(); window.history.pushState(null, '', window.location.href); };
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 50 && lastY > y && lastY - y > 30) show();
      lastY = y;
    };
    let touchY = 0;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchEnd = (e) => { if (touchY < 100 && e.changedTouches[0].clientY - touchY > 100) show(); };

    window.history.pushState(null, '', window.location.href);

    const intentTimer = setTimeout(() => {
      document.addEventListener('mouseleave', onLeave);
      window.addEventListener('popstate', onPop);
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('touchstart', onTouchStart, { passive: true });
      document.addEventListener('touchend', onTouchEnd, { passive: true });
    }, 1500);

    return () => {
      clearTimeout(autoTimer);
      clearTimeout(intentTimer);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [show]);

  useEffect(() => {
    if (!visible) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [visible]);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!API_URL) {
      setErrors({ submit: 'Form is not configured. Please email contact.weroi@gmail.com.' });
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      const priorName = (() => {
        try {
          const draft = JSON.parse(localStorage.getItem('weroi_growthiq_draft') || '{}');
          return draft?.data?.full_name || '';
        } catch {
          return '';
        }
      })();

      const r = await fetch(`${API_URL}/api/leads/guide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: priorName,
          referrer: document.referrer || null,
          source: 'exit_intent_checklist',
        }),
      });
      const contentType = r.headers.get('content-type') || '';
      if (!r.ok || !contentType.includes('application/json')) {
        throw new Error(`Request failed (${r.status})`);
      }
      await r.json();
      sessionStorage.setItem('checklistFormData', JSON.stringify({ email: email.trim() }));
      track('popup_submit');
      setSuccess(true);
    } catch {
      setErrors({
        submit: 'We could not send the checklist. Please try again or email contact.weroi@gmail.com.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => setVisible(false);

  if (!visible) return null;

  return (
    <div className="popup-overlay" onClick={closeModal} data-testid="exit-popup">
      <div className="popup-card" onClick={(ev) => ev.stopPropagation()}>
        <button className="popup-close" onClick={closeModal} data-testid="close-popup-btn" aria-label="Close">
          <X size={16} />
        </button>

        <div className="popup-visual">
          <div className="popup-tag">FREE CHECKLIST</div>
          <div>
            <h3 className="popup-visual-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, lineHeight: 1.0, letterSpacing: '-0.02em', margin: 0, color: 'var(--paper)' }}>
              5 Signs Your Business<br />Is Invisible Online
            </h3>
            <p className="popup-visual-desc" style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,0.7)', marginTop: 12, marginBottom: 0 }}>
              Not broken. Not bad. Just harder to find than it should be. A quick check. No website required.
            </p>
          </div>

          <div className="popup-guide-card">
            <div className="popup-guide-row">
              <div className="popup-guide-icon"><ClipboardList size={18} /></div>
              <div>
                <div className="popup-guide-title">weROI Visibility Checklist</div>
                <div className="popup-guide-meta">1 page · 2 min read</div>
              </div>
            </div>
            <ul className="popup-guide-list">
              <li>5 quick signs your business is harder to find than it should be</li>
              <li>Applies whether you have a website or not</li>
              <li>Free GrowthIQ score if you want the full picture</li>
            </ul>
          </div>
        </div>

        <div className="popup-form-section">
          {!success ? (
            <>
              <h2 className="popup-headline">
                Before you go. See what might be<br />
                <span className="accent">making you invisible.</span>
              </h2>
              <p className="popup-sub">
                Enter your email. We&apos;ll send the checklist instantly, plus a link to get your free personalized
                weROI GrowthIQ™ score if you want the full breakdown.
              </p>

              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  className={`popup-input ${errors.email ? 'error' : ''}`}
                  data-testid="popup-email-input"
                />
                {errors.email && <span className="audit-error">{errors.email}</span>}
                {errors.submit && <span className="audit-error" role="alert">{errors.submit}</span>}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={submitting}
                  data-testid="popup-submit-btn"
                  style={{ marginTop: 4 }}
                >
                  {submitting ? 'Sending…' : 'Send Me the Checklist'} {!submitting && <ArrowRight size={16} />}
                </button>
              </form>

              <p className="popup-disclaimer">{TRUST_LINE}</p>
            </>
          ) : (
            <div className="popup-success" data-testid="popup-success">
              <h2 className="popup-headline">
                Check your inbox.<br />
                <span className="accent">your checklist PDF is on the way.</span>
              </h2>
              <p className="popup-sub" style={{ marginBottom: 16 }}>
                We sent the full <strong>5 Signs Your Business Is Invisible Online</strong> checklist as a
                weROI-branded PDF. It is attached to the email and ready to download.
              </p>
              <div className="popup-giq-block">
                <h3>Want the full picture?</h3>
                <p>
                  The checklist tells you what to look for. GrowthIQ™ tells you exactly where you&apos;re invisible
                  right now, website or not. Free, personalized, takes 3-5 minutes.
                </p>
                <Link to="/growth-preview" className="btn btn-primary btn-lg" onClick={closeModal}>
                  Show Me My Score <ArrowRight size={16} />
                </Link>
                <button type="button" className="popup-maybe-later" onClick={closeModal}>
                  Maybe later
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
