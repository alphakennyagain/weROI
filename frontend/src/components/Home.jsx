import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, TrendingUp, Bot, Rocket, Handshake, Target, Compass, PenTool, Send, CheckCircle2, XCircle, Zap, BarChart3, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExitIntentPopup from './ExitIntentPopup';

const AnimatedGrid = () => {
  return (
    <div className="animated-grid-bg">
      <div className="grid-overlay"></div>
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>
    </div>
  );
};

// Trust Ticker Component
const TrustTicker = () => {
  const tickerItems = [
    'Measurable AI Growth',
    'Bespoke Scaling Systems',
    'Automated ROI Architecture',
    'Data-Driven Decisions',
    'Predictable Revenue',
    'System Over Shortcuts'
  ];

  return (
    <div className="trust-ticker">
      <div className="ticker-track">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div key={index} className="ticker-item">
            <span className="ticker-dot"></span>
            <span className="ticker-text">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CountUpStat = ({ end, suffix = '+', label, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = end / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, end, delay]);

  return (
    <div ref={ref} className="authority-card glass-card">
      <div className="authority-stat gradient-text">{count}{suffix}</div>
      <div className="authority-label">{label}</div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorOpacity, setCursorOpacity] = useState(0.05);
  const [hoveredCard, setHoveredCard] = useState(null);

  const API_URL = process.env.REACT_APP_BACKEND_URL || '';
  const sessionId = sessionStorage.getItem('sessionId') || (() => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', id);
    return id;
  })();

  // Track page view on mount
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch(`${API_URL}/api/analytics/event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'page_view',
            page: '/',
            referrer: document.referrer || null,
            session_id: sessionId
          })
        });
      } catch (err) {
        console.log('Analytics tracking failed:', err);
      }
    };
    trackPageView();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const brightnessInterval = setInterval(() => {
      setCursorOpacity((prev) => {
        if (prev < 0.22) {
          return prev + 0.002;
        }
        return prev;
      });
    }, 1000);

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

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(brightnessInterval);
    };
  }, []);

  // Three Pillars of Service
  const servicePillars = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: 'AI Audit & Transformation',
      subtitle: 'Identify measurable AI value. Deploy safely.',
      services: [
        'All-Star AI Growth Audit',
        'Technical & Data Security Audit',
        'Agent Design with AI Workflows',
        'Model Governance & Monitoring',
        'Complete AI Transformation'
      ]
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Growth Systems Applications',
      subtitle: 'Practical systems built fast.',
      services: [
        'Website Build / Redesign',
        'Branding & Visual Identity',
        'CRM & Operational Systems',
        'Marketing Systems (Inbound/Outbound)',
        'Content & Social Production',
        'Paid Ads & Local SEO'
      ]
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: 'Scale Partnerships',
      subtitle: 'One partner. Total accountability.',
      services: [
        'Revenue-Focused Partnership',
        'Monthly Optimization & A/B Testing',
        'AI Maintenance & Prompt Engineering',
        'Routine Reporting & Dashboards',
        'Complete Strategic Growth Partner'
      ]
    }
  ];

  // Process Steps - Align -> Diagnose -> Design -> Deliver
  const processSteps = [
    {
      icon: <Compass className="w-6 h-6" />,
      number: 'ALIGN',
      title: 'Align & Collect',
      description: 'Meet with stakeholders, gather core artifacts — revenue data, proposals, CRM export, org structure.',
      deliverable: 'Executive Audit & Baseline Workbook'
    },
    {
      icon: <Target className="w-6 h-6" />,
      number: 'DIAGNOSE',
      title: 'Diagnose & Map',
      description: 'Deep dives across sales, marketing, and delivery. Map value chain, quantify leaks, surface impact levers.',
      deliverable: 'Opportunity Map & Top 10 Inefficiencies'
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      number: 'DESIGN',
      title: 'Design the Pilot',
      description: 'Turn highest-value lever into testable hypothesis. Build pilot plan, security checklist, measurement design.',
      deliverable: 'Pilot Implementation Plan & ROI Workbook'
    },
    {
      icon: <Send className="w-6 h-6" />,
      number: 'DELIVER',
      title: 'Deliver & Scale',
      description: 'Execute the pilot, validate results, then scale through implementation or ongoing Growth Partnership.',
      deliverable: 'Validated System & Scale Roadmap'
    }
  ];

  const testimonials = [
    {
      quote: "weROI engineered a lead system that 3x'd our qualified appointments in 60 days. No fluff, just results.",
      name: 'Marcus Thompson',
      business: 'Elite Cuts Barbershop',
      result: '3x Appointments'
    },
    {
      quote: "They built infrastructure that generates leads while we sleep. Our CAC dropped 40% in the first quarter.",
      name: 'Sarah Chen',
      business: 'Tech Repair Pro',
      result: '40% Lower CAC'
    },
    {
      quote: "Finally, a partner who speaks ROI, not vanity metrics. Revenue is up, stress is down.",
      name: 'David Martinez',
      business: 'Martinez Legal Services',
      result: '2.5x Revenue'
    }
  ];

  return (
    <div className="home-container">
      <AnimatedGrid />
      <ExitIntentPopup />
      
      {/* Cursor Glow Effect */}
      <div 
        className="cursor-glow" 
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          opacity: cursorOpacity
        }}
      />
      
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="container nav-content">
          <div className="logo">
            <TrendingUp className="logo-icon growth-icon" size={20} />
            <span className="we-text">we</span><span className="roi-text">ROI</span>
          </div>
          <div className="nav-links">
            <a href="#services" className="nav-link">What We Do</a>
            <a href="#process" className="nav-link">How We Work</a>
            <a href="#reviews" className="nav-link">Results</a>
            <button 
              data-testid="nav-cta-btn"
              className="btn-primary glow-on-hover" 
              onClick={() => navigate('/audit')}
            >
              Claim Your Free AI Growth Audit
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="section-hero">
        <div className="container">
          <div className={`hero-content ${isVisible['section-hero'] ? 'fade-in-up' : ''}`}>
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Growth Systems That Scale
            </div>
            <h1 className="hero-title">
              We Engineer Revenue.<br />
              <span className="gradient-text">You Own the System.</span>
            </h1>
            <p className="hero-subtitle">
              AI-powered growth infrastructure for businesses ready to scale. 
              No guesswork. No vanity metrics. Just measurable ROI.
            </p>
            <div className="hero-cta-group">
              <button 
                data-testid="hero-cta-btn"
                className="btn-primary btn-large glow-on-hover" 
                onClick={() => navigate('/audit')}
              >
                Claim Your Free AI Growth Audit
                <ArrowRight className="ml-2" size={20} />
              </button>
              <button 
                className="btn-secondary btn-large" 
                onClick={() => document.getElementById('process').scrollIntoView({ behavior: 'smooth' })}
              >
                See How We Work
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Ticker */}
      <TrustTicker />

      {/* Authority Section - Stats */}
      <section className="authority-section" id="section-authority">
        <div className="container">
          <div className={`authority-grid ${isVisible['section-authority'] ? 'fade-in-up' : ''}`}>
            <CountUpStat end={127} suffix="+" label="Growth Systems Deployed" delay={0} />
            <CountUpStat end={3.2} suffix="x" label="Average Revenue Lift" delay={200} />
            <CountUpStat end={94} suffix="%" label="Client Retention Rate" delay={400} />
          </div>
        </div>
      </section>

      {/* About Section - Who We Are */}
      <section className="about-section" id="section-about">
        <div className="container">
          <div className={`about-content ${isVisible['section-about'] ? 'fade-in-up' : ''}`}>
            <div className="about-text">
              <h2 className="section-title">Built for Founders Who Demand ROI</h2>
              <p className="about-description">
                weROI was engineered from a simple truth: <strong>if your business can run without you, 
                you don't have a business—you have a job.</strong>
              </p>
              <p className="about-description">
                We build scalable growth systems that work in the background. AI-powered automation, 
                conversion infrastructure, and strategic partnerships that turn attention into revenue—predictably.
              </p>
              <div className="about-features">
                <div className="about-feature">
                  <Shield size={20} className="feature-icon" />
                  <span>No jargon. No theory. Just proof that systems pay for themselves.</span>
                </div>
                <div className="about-feature">
                  <BarChart3 size={20} className="feature-icon" />
                  <span>Data-driven decisions. Every action tied to measurable outcomes.</span>
                </div>
                <div className="about-feature">
                  <Users size={20} className="feature-icon" />
                  <span>One partner, total accountability. No more agency juggling.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Three Pillars with Interactive Cards */}
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-header" id="section-services">
            <h2 className={`section-title ${isVisible['section-services'] ? 'fade-in-up' : ''}`}>
              What We Do
            </h2>
            <p className={`section-subtitle ${isVisible['section-services'] ? 'fade-in-up' : ''}`}>
              Three pillars of growth. Comprehensive systems engineered for scale.
            </p>
          </div>
          <div className="pillars-grid">
            {servicePillars.map((pillar, index) => (
              <div 
                key={index} 
                className={`pillar-card glass-card interactive-card ${isVisible['section-services'] ? 'fade-in-up' : ''} ${hoveredCard === index ? 'hovered' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-blur-bg"></div>
                <div className="pillar-icon-wrapper">
                  <div className="pillar-icon">{pillar.icon}</div>
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-subtitle">{pillar.subtitle}</p>
                <ul className="pillar-services">
                  {pillar.services.map((service, i) => (
                    <li key={i}>
                      <Zap size={14} className="service-bullet" />
                      {service}
                    </li>
                  ))}
                </ul>
                <button 
                  className="btn-ghost learn-more-btn"
                  onClick={() => navigate('/audit')}
                >
                  Learn More
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - How We Work */}
      <section className="process-section" id="process">
        <div className="container">
          <div className="section-header" id="section-process">
            <h2 className={`section-title ${isVisible['section-process'] ? 'fade-in-up' : ''}`}>
              How We Work
            </h2>
            <p className={`section-subtitle ${isVisible['section-process'] ? 'fade-in-up' : ''}`}>
              The All-Star AI Growth Framework
            </p>
          </div>
          <div className="process-timeline">
            {processSteps.map((step, index) => (
              <div 
                key={index} 
                className={`process-step ${isVisible['section-process'] ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="process-step-header">
                  <div className="process-icon">{step.icon}</div>
                  <span className="process-number gradient-text">{step.number}</span>
                </div>
                <div className="process-step-content glass-card">
                  <h3 className="process-title">{step.title}</h3>
                  <p className="process-description">{step.description}</p>
                  <div className="process-deliverable">
                    <CheckCircle2 size={16} className="deliverable-icon" />
                    <span>{step.deliverable}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section" id="reviews">
        <div className="container">
          <div className="section-header" id="section-reviews">
            <h2 className={`section-title ${isVisible['section-reviews'] ? 'fade-in-up' : ''}`}>
              Engineered Results
            </h2>
            <p className={`section-subtitle ${isVisible['section-reviews'] ? 'fade-in-up' : ''}`}>
              ROI our clients can measure
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`testimonial-card glass-card ${isVisible['section-reviews'] ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="testimonial-result gradient-text">{testimonial.result}</div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.name.charAt(0)}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-business">{testimonial.business}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="who-section" id="section-who">
        <div className="container">
          <h2 className={`section-title text-center ${isVisible['section-who'] ? 'fade-in-up' : ''}`}>
            Is weROI Right For You?
          </h2>
          <div className="who-grid">
            <div className={`who-card glass-card who-for ${isVisible['section-who'] ? 'fade-in-up' : ''}`}>
              <h3 className="who-title">✓ We Engineer Growth For:</h3>
              <ul className="who-list">
                <li><CheckCircle2 size={20} /> Founders ready to scale beyond manual operations</li>
                <li><CheckCircle2 size={20} /> Businesses seeking AI-powered competitive advantage</li>
                <li><CheckCircle2 size={20} /> Teams tired of agencies that can't prove ROI</li>
                <li><CheckCircle2 size={20} /> Leaders who value systems over shortcuts</li>
                <li><CheckCircle2 size={20} /> Companies ready to invest in long-term infrastructure</li>
              </ul>
            </div>
            <div className={`who-card glass-card who-not ${isVisible['section-who'] ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.1s' }}>
              <h3 className="who-title">✗ This Isn't For:</h3>
              <ul className="who-list">
                <li><XCircle size={20} /> Businesses looking for quick fixes or magic bullets</li>
                <li><XCircle size={20} /> Those who want cheap templates over custom systems</li>
                <li><XCircle size={20} /> Anyone not ready to invest in real growth</li>
                <li><XCircle size={20} /> Leaders who chase vanity metrics over revenue</li>
                <li><XCircle size={20} /> Companies unwilling to implement and iterate</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="section-cta">
        <div className="container">
          <div className={`cta-card glass-card ${isVisible['section-cta'] ? 'fade-in-up' : ''}`}>
            <h2 className="cta-title">Ready to Engineer Your Growth?</h2>
            <p className="cta-subtitle">
              Get a personalized AI Growth Audit. Discover exactly where revenue is leaking 
              and what systems will capture it.
            </p>
            <button 
              data-testid="cta-btn"
              className="btn-primary btn-large glow-on-hover" 
              onClick={() => navigate('/audit')}
            >
              Claim Your Free AI Growth Audit
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="footer-premium">
        <div className="container">
          <div className="footer-content">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <TrendingUp size={24} className="footer-logo-icon" />
                <span className="we-text">we</span><span className="roi-text">ROI</span>
              </div>
              <p className="footer-tagline">Engineered for Growth</p>
            </div>

            {/* Contact */}
            <div className="footer-contact">
              <h4>Get In Touch</h4>
              <a href="mailto:contact.weroi@gmail.com" className="footer-email">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                contact.weroi@gmail.com
              </a>
            </div>

            {/* Social */}
            <div className="footer-social">
              <h4>Follow Us</h4>
              <a 
                href="https://www.instagram.com/weroi.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-instagram-link"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @weroi.co
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p className="footer-copyright">© 2025 weROI. All rights reserved.</p>
            <p className="footer-noreply">For automated emails: growth@weroi.net</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
