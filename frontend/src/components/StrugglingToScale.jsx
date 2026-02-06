import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, TrendingUp, CheckCircle, AlertTriangle, Target, BarChart3, Users, Zap, Download, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StrugglingToScale = () => {
  const navigate = useNavigate();
  const [surveyAnswers, setSurveyAnswers] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const pdfSectionRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get survey answers from sessionStorage
    const storedAnswers = sessionStorage.getItem('growthSurveyAnswers');
    if (storedAnswers) {
      setSurveyAnswers(JSON.parse(storedAnswers));
    }

    // Intersection Observer for scroll reveals
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToPdf = () => {
    pdfSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const problems = [
    {
      icon: <AlertTriangle size={24} />,
      title: 'Lack of Online Trust',
      description: 'Potential customers can\'t verify your reputation. No reviews, outdated listings, weak presence.',
      stat: '90%',
      statLabel: 'search online before buying'
    },
    {
      icon: <Users size={24} />,
      title: 'Unanswered Questions',
      description: 'Customers leave when questions go unanswered. Your competitors respond faster.',
      stat: '70%',
      statLabel: 'of websites fail to convert'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'No Tracking Systems',
      description: 'You don\'t know what\'s working. Marketing spend disappears into the void.',
      stat: '3-5x',
      statLabel: 'more reviews with systems'
    },
    {
      icon: <Target size={24} />,
      title: 'Weak Follow-Up',
      description: 'Most leads don\'t convert on first contact. Without follow-up, you lose 60%+ of potential revenue.',
      stat: '20-40%',
      statLabel: 'more conversions with follow-up'
    }
  ];

  const solutions = [
    {
      step: '01',
      title: 'Build Professional Presence',
      points: ['Google Business Profile optimization', 'Conversion-focused website', 'NAP consistency across platforms']
    },
    {
      step: '02',
      title: 'Answer Before They Ask',
      points: ['FAQ systems & chatbots', 'Email templates for speed', 'Easy contact options']
    },
    {
      step: '03',
      title: 'Leverage Social Proof',
      points: ['Systematic review generation', 'Response management', 'Trust signal visibility']
    },
    {
      step: '04',
      title: 'Track What Works',
      points: ['Customer acquisition cost', 'Channel performance', 'Lead source identification']
    },
    {
      step: '05',
      title: 'Automate Follow-Up',
      points: ['Onboarding sequences', 'Re-engagement campaigns', 'Predictable lead flow']
    }
  ];

  return (
    <div className="scale-page">
      {/* Animated Background */}
      <div className="animated-grid-bg">
        <div className="grid-overlay"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Navigation */}
      <nav className="nav-bar">
        <div className="container nav-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <TrendingUp className="logo-icon growth-icon" size={20} />
            <span className="we-text">we</span><span className="roi-text">ROI</span>
          </div>
          <button 
            data-testid="apply-audit-nav-btn"
            className="btn-primary" 
            onClick={() => navigate('/book-call')}
          >
            Apply for Growth Audit
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="scale-hero" id="section-hero">
        <div className="container">
          <div className={`scale-hero-content ${isVisible['section-hero'] ? 'fade-in-up' : ''}`}>
            <div className="hero-badge">
              <span className="badge-dot"></span>
              The weROI Growth System
            </div>
            <h1 className="scale-hero-title">
              Struggling to Scale Your Business<br />
              <span className="gradient-text">& Turn Viewers Into Customers?</span>
            </h1>
            <p className="scale-hero-subtitle">
              You're not alone. Most businesses lose customers online because they lack the systems 
              to capture attention, build trust, and convert interest into revenue.
            </p>
            <div className="hero-actions">
              <button 
                data-testid="download-guide-hero-btn"
                className="btn-primary btn-large glow-on-hover"
                onClick={scrollToPdf}
              >
                Download Your Free Growth Guide
                <ArrowDown className="ml-2" size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problems-section" id="section-problems">
        <div className="container">
          <div className="section-header">
            <h2 className={`section-title ${isVisible['section-problems'] ? 'fade-in-up' : ''}`}>
              Why Growth Stalls
            </h2>
            <p className={`section-subtitle ${isVisible['section-problems'] ? 'fade-in-up' : ''}`}>
              The invisible costs eating your revenue
            </p>
          </div>
          <div className="problems-grid">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className={`problem-card glass-card ${isVisible['section-problems'] ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="problem-icon">{problem.icon}</div>
                <h3 className="problem-title">{problem.title}</h3>
                <p className="problem-description">{problem.description}</p>
                <div className="problem-stat">
                  <span className="stat-value gradient-text">{problem.stat}</span>
                  <span className="stat-label">{problem.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solutions-section" id="section-solutions">
        <div className="container">
          <div className="section-header">
            <h2 className={`section-title ${isVisible['section-solutions'] ? 'fade-in-up' : ''}`}>
              The 5-Step Growth System
            </h2>
            <p className={`section-subtitle ${isVisible['section-solutions'] ? 'fade-in-up' : ''}`}>
              Transform visibility into predictable revenue
            </p>
          </div>
          <div className="solutions-timeline">
            {solutions.map((solution, index) => (
              <div 
                key={index}
                className={`solution-item ${isVisible['section-solutions'] ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="solution-step gradient-text">{solution.step}</div>
                <div className="solution-content glass-card">
                  <h3 className="solution-title">{solution.title}</h3>
                  <ul className="solution-points">
                    {solution.points.map((point, i) => (
                      <li key={i}>
                        <CheckCircle size={16} className="point-icon" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Happens When It Works */}
      <section className="synergy-section" id="section-synergy">
        <div className="container">
          <div className={`synergy-card glass-card ${isVisible['section-synergy'] ? 'fade-in-up' : ''}`}>
            <div className="synergy-icon">
              <Zap size={48} />
            </div>
            <h2 className="synergy-title">
              When Everything Works Together
            </h2>
            <div className="synergy-points">
              <div className="synergy-point">
                <CheckCircle size={20} className="synergy-check" />
                <span>Visibility increases automatically</span>
              </div>
              <div className="synergy-point">
                <CheckCircle size={20} className="synergy-check" />
                <span>Trust builds before first contact</span>
              </div>
              <div className="synergy-point">
                <CheckCircle size={20} className="synergy-check" />
                <span>Leads feel warmer, close faster</span>
              </div>
              <div className="synergy-point">
                <CheckCircle size={20} className="synergy-check" />
                <span>Growth becomes predictable</span>
              </div>
            </div>
            <p className="synergy-tagline">
              "This is not about doing more — it's about structuring what already exists."
            </p>
          </div>
        </div>
      </section>

      {/* PDF Section */}
      <section className="pdf-section" id="section-pdf" ref={pdfSectionRef}>
        <div className="container">
          <div className="section-header">
            <h2 className={`section-title ${isVisible['section-pdf'] ? 'fade-in-up' : ''}`}>
              Your Free Growth Guide
            </h2>
            <p className={`section-subtitle ${isVisible['section-pdf'] ? 'fade-in-up' : ''}`}>
              The complete weROI framework for turning visibility into revenue
            </p>
          </div>
          
          <div className={`pdf-wrapper glass-card ${isVisible['section-pdf'] ? 'fade-in-up' : ''}`}>
            <div className="pdf-header">
              <div className="pdf-info">
                <h3>THE WEROI GROWTH GUIDE</h3>
                <p>How Businesses Lose Customers Online — and How to Turn Visibility Into Revenue</p>
              </div>
              <a 
                href="https://customer-assets.emergentagent.com/job_premium-scale-3/artifacts/xl4qmsi8_WEROI%20GROWTH%20GUIDE.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary download-btn"
                data-testid="download-pdf-btn"
              >
                <Download size={20} />
                Download PDF
              </a>
            </div>
            <div className="pdf-embed">
              <iframe
                src="https://customer-assets.emergentagent.com/job_premium-scale-3/artifacts/xl4qmsi8_WEROI%20GROWTH%20GUIDE.pdf#view=FitH"
                title="weROI Growth Guide"
                className="pdf-iframe"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="sticky-cta">
        <div className="container">
          <div className="sticky-cta-content">
            <div className="sticky-cta-text">
              <span className="sticky-cta-label">Ready to automate this?</span>
              <span className="sticky-cta-headline">Apply for a Growth Audit</span>
            </div>
            <button 
              data-testid="apply-audit-sticky-btn"
              className="btn-primary glow-on-hover"
              onClick={() => navigate('/book-call')}
            >
              Apply Now
              <ArrowRight className="ml-2" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="scale-footer">
        <div className="container">
          <div className="footer-bottom">
            <div className="footer-logo">
              <TrendingUp className="logo-icon growth-icon" size={20} />
              <span className="we-text">we</span><span className="roi-text">ROI</span>
            </div>
            <p>© 2025 weROI. Engineered for Growth.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StrugglingToScale;
