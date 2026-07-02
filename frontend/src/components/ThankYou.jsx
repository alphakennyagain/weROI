import React, { useEffect, useState } from 'react';
import { Check, ArrowRight, Mail, Clock, Calendar } from 'lucide-react';
import SiteHeader from './SiteHeader';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'guide';
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const key = type === 'audit' ? 'auditFormData' : 'guideFormData';
    const stored = sessionStorage.getItem(key);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, [type]);

  const isAudit = type === 'audit';

  const steps = isAudit ? [
    { num: '01', title: 'Confirmation email', desc: 'Check your inbox for a confirmation and next steps.', time: 'IN 5 MIN' },
    { num: '02', title: 'Discovery call',     desc: 'We schedule a 30-minute deep dive into your business.', time: 'WITHIN 48H' },
    { num: '03', title: 'Custom roadmap',     desc: 'Receive your personalized AI Growth Audit report.',    time: 'WEEK 1' },
  ] : [
    { num: '01', title: 'Email 1: Your guide',       desc: 'The $0 to $1M Blueprint is landing in your inbox now.',    time: 'NOW' },
    { num: '02', title: 'Email 2: The value add',    desc: 'Why DIY scaling usually fails + our exact solution.',     time: '+24H' },
    { num: '03', title: 'Email 3: Your roadmap',     desc: 'Exclusive offer for a Free AI Growth Audit.',             time: '+48H' },
  ];

  return (
    <div className="thanks-page" data-testid="thanks-page">
      <SiteHeader
        logoTestId="thanks-logo"
        logoOnClick={() => navigate('/')}
        navTestId="thanks-nav"
        showCenterLinks={false}
        showDesktopCta={false}
      />

      <div className="thanks-wrap">
        <div className="thanks-mark">
          <Check size={24} />
        </div>

        <span className="pill" style={{ marginBottom: 24 }}>
          <span className="pill-dot" />
          <span className="pill-mono">{isAudit ? 'AUDIT REQUEST RECEIVED' : 'GUIDE ON THE WAY'}</span>
        </span>

        <h1 className="thanks-display">
          {isAudit ? <>You&rsquo;re in.<br /><span style={{ borderBottom: '5px solid var(--lime)' }}>Audit requested.</span></> : <>Success.<br /><span style={{ borderBottom: '5px solid var(--lime)' }}>Check your inbox.</span></>}
        </h1>

        <p className="body thanks-sub">
          {isAudit
            ? <>We&rsquo;ve received your audit request. Our team will reach out within <strong>48 hours</strong> with your personalized growth analysis.</>
            : <>Your guide is on its way to <strong>{user?.email || 'your inbox'}</strong>. While you wait, here&rsquo;s exactly what to expect next.</>
          }
        </p>

        <div className="thanks-steps" data-testid="thanks-steps">
          {steps.map((s) => (
            <div key={s.num} className="thanks-step">
              <div className="thanks-step-num">{s.num} · {isAudit ? <Calendar size={12} style={{ display: 'inline', verticalAlign: '-2px' }} /> : <Mail size={12} style={{ display: 'inline', verticalAlign: '-2px' }} />}</div>
              <div>
                <h3 className="thanks-step-title">{s.title}</h3>
                <p className="thanks-step-desc">{s.desc}</p>
              </div>
              <div className="thanks-step-time">
                <Clock size={11} style={{ verticalAlign: '-1px' }} /> {s.time}
              </div>
            </div>
          ))}
        </div>

        <div className="thanks-actions">
          {!isAudit && (
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/growth-preview')} data-testid="claim-audit-btn">
              Get My GrowthIQ Score <ArrowRight size={16} />
            </button>
          )}
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/')} data-testid="back-home-btn">
            Back to home
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/#case-studies')} data-testid="see-work-btn">
            See our work
          </button>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
            <span>© 2026 weROI Jamaica</span>
            <nav className="footer-legal" aria-label="Legal">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="footer-legal-sep" aria-hidden="true">·</span>
              <Link to="/terms">Terms of Service</Link>
            </nav>
            <span className="mono" style={{ fontSize: 12 }}>Engineered for growth</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ThankYou;
