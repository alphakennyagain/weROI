import React, { useEffect, useState } from 'react';
import { TrendingUp, Play, CheckCircle, ArrowRight, Mail, Clock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'guide';
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get stored form data
    const storageKey = type === 'audit' ? 'auditFormData' : 'guideFormData';
    const storedData = sessionStorage.getItem(storageKey);
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, [type]);

  const isAudit = type === 'audit';

  return (
    <div className="thank-you-page">
      {/* Animated Background */}
      <div className="animated-grid-bg">
        <div className="grid-overlay"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      {/* Navigation */}
      <nav className="nav-bar">
        <div className="container nav-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <TrendingUp className="logo-icon growth-icon" size={20} />
            <span className="we-text">we</span><span className="roi-text">ROI</span>
          </div>
        </div>
      </nav>

      <div className="thank-you-container">
        <div className="container">
          {/* Success Header */}
          <div className="thank-you-header fade-in-up">
            <div className="success-icon-wrapper">
              <CheckCircle size={64} className="success-check" />
            </div>
            <h1 className="thank-you-title">
              {isAudit ? (
                <>You're In! <span className="gradient-text">Audit Requested.</span></>
              ) : (
                <>Success! <span className="gradient-text">Check Your Inbox.</span></>
              )}
            </h1>
            <p className="thank-you-subtitle">
              {isAudit ? (
                <>We've received your audit request. Our team will reach out within <strong>48 hours</strong> with your personalized growth analysis.</>
              ) : (
                <>Your guide is on its way to <strong>{userData?.email || 'your inbox'}</strong>. While you wait, watch how we implemented these exact steps for a client last month.</>
              )}
            </p>
          </div>

          {/* Video Placeholder Section */}
          <div className="video-section glass-card fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="video-placeholder">
              <div className="video-overlay">
                <div className="play-button">
                  <Play size={48} fill="#111113" />
                </div>
                <span className="video-duration">Coming Soon</span>
              </div>
              <div className="video-content">
                <div className="video-text">
                  <h3>Case Study: $0 to $1M in 12 Months</h3>
                  <p>See exactly how we helped a local business scale using these systems</p>
                </div>
              </div>
            </div>
            <div className="video-caption">
              <Clock size={16} />
              <span>Video content coming soon — Subscribe to get notified</span>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="whats-next-section fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="section-title">What Happens Next?</h2>
            <div className="next-steps">
              {isAudit ? (
                <>
                  <div className="next-step glass-card">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Confirmation Email</h4>
                      <p>Check your inbox for a confirmation with next steps</p>
                    </div>
                  </div>
                  <div className="next-step glass-card">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Discovery Call</h4>
                      <p>We'll schedule a 30-minute deep dive into your business</p>
                    </div>
                  </div>
                  <div className="next-step glass-card">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Custom Roadmap</h4>
                      <p>Receive your personalized AI Growth Audit report</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="next-step glass-card">
                    <div className="step-number">
                      <Mail size={20} />
                    </div>
                    <div className="step-content">
                      <h4>Email 1: Your Guide</h4>
                      <p>The $0 to $1M Blueprint is landing in your inbox now</p>
                    </div>
                  </div>
                  <div className="next-step glass-card">
                    <div className="step-number">
                      <Clock size={20} />
                    </div>
                    <div className="step-content">
                      <h4>Email 2: The Value Add</h4>
                      <p>Tomorrow: Why DIY scaling usually fails + our solution</p>
                    </div>
                  </div>
                  <div className="next-step glass-card">
                    <div className="step-number">
                      <TrendingUp size={20} />
                    </div>
                    <div className="step-content">
                      <h4>Email 3: Your Custom Roadmap</h4>
                      <p>Day 3: Exclusive offer for a Free AI Growth Audit</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="thank-you-cta fade-in-up" style={{ animationDelay: '0.6s' }}>
            {!isAudit && (
              <div className="cta-card glass-card">
                <h3>Can't Wait for the Emails?</h3>
                <p>Skip the line and claim your Free AI Growth Audit now</p>
                <button 
                  className="btn-primary glow-on-hover"
                  onClick={() => navigate('/audit')}
                  data-testid="claim-audit-btn"
                >
                  Claim Your Free AI Growth Audit
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
            
            <button 
              className="btn-secondary"
              onClick={() => navigate('/')}
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="thank-you-footer">
        <div className="container">
          <div className="footer-minimal">
            <div className="footer-logo">
              <TrendingUp className="logo-icon growth-icon" size={16} />
              <span className="we-text">we</span><span className="roi-text">ROI</span>
            </div>
            <p>© 2025 weROI. Engineered for Growth.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ThankYou;
