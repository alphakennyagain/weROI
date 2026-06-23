import React, { useState, useEffect, useCallback } from 'react';
import { X, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExitIntentPopup = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});

  const API_URL = process.env.REACT_APP_BACKEND_URL || '';
  const sid = sessionStorage.getItem('sessionId') || (() => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', id);
    return id;
  })();

  const track = async (event_type) => {
    try {
      await fetch(`${API_URL}/api/analytics/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type, page: '/', referrer: document.referrer || null, session_id: sid }),
      });
    } catch {}
  };

  const show = useCallback(() => {
    if (!triggered) {
      setVisible(true);
      setTriggered(true);
      sessionStorage.setItem('exitPopupShown', 'true');
      track('popup_shown');
    }
  }, [triggered]);

  useEffect(() => {
    if (sessionStorage.getItem('exitPopupShown')) {
      setTriggered(true);
      return;
    }
    const t1 = setTimeout(show, 5000);
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

    const t2 = setTimeout(() => {
      document.addEventListener('mouseleave', onLeave);
      window.addEventListener('popstate', onPop);
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('touchstart', onTouchStart, { passive: true });
      document.addEventListener('touchend', onTouchEnd, { passive: true });
    }, 2000);

    return () => {
      clearTimeout(t1); clearTimeout(t2);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [show]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/api/leads/guide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, referrer: document.referrer || null }),
      });
    } catch {}
    sessionStorage.setItem('guideFormData', JSON.stringify(form));
    setVisible(false);
    navigate('/thank-you?type=guide');
  };

  if (!visible) return null;

  return (
    <div className="popup-overlay" onClick={() => setVisible(false)} data-testid="exit-popup">
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={() => setVisible(false)} data-testid="close-popup-btn" aria-label="Close">
          <X size={16} />
        </button>

        <div className="popup-visual">
          <div className="popup-tag">FREE GUIDE</div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, lineHeight: 1.0, letterSpacing: '-0.02em', margin: 0, color: 'var(--paper)' }}>
              From $0 to $1M:<br />Your Growth Plan
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,0.7)', marginTop: 12, marginBottom: 0 }}>
              The same plan we use with our clients. Get more customers, improve your website and systems, and stop wasting money on ads that do not pay off.
            </p>
          </div>

          <div className="popup-guide-card">
            <div className="popup-guide-row">
              <div className="popup-guide-icon"><BookOpen size={18} /></div>
              <div>
                <div className="popup-guide-title">weROI Growth Guide</div>
                <div className="popup-guide-meta">24 pages · PDF</div>
              </div>
            </div>
            <ul className="popup-guide-list">
              <li>4 clear steps to grow your sales</li>
              <li>Ready to use templates for your team</li>
              <li>Real example: $0 to $1M in 12 months</li>
            </ul>
          </div>
        </div>

        <div className="popup-form-section">
          <h2 className="popup-headline">
            Take the plan<br />
            <span className="accent">before you go.</span>
          </h2>
          <p className="popup-sub">
            Enter your name and email. We will send the full guide to your inbox with clear steps to win more customers and grow your business.
          </p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`popup-input ${errors.name ? 'error' : ''}`}
              data-testid="popup-name-input"
            />
            {errors.name && <span className="audit-error">{errors.name}</span>}
            <input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`popup-input ${errors.email ? 'error' : ''}`}
              data-testid="popup-email-input"
            />
            {errors.email && <span className="audit-error">{errors.email}</span>}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
              data-testid="popup-submit-btn"
              style={{ marginTop: 4 }}
            >
              {submitting ? 'Sending…' : 'Email me the free guide'} {!submitting && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="popup-disclaimer">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
