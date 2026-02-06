import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, TrendingUp, Bot, Rocket, Handshake, Target, Compass, PenTool, Send, CheckCircle2, XCircle, Instagram, Mail, Phone, Zap, BarChart3, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
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
            <a href="#services" className="nav-link">Services</a>
            <a href="#process" className="nav-link">Our Process</a>
            <a href="#reviews" className="nav-link">Results</a>
            <button 
              data-testid="nav-cta-btn"
              className="btn-primary" 
              onClick={() => navigate('/growth-survey')}
            >
              Get Growth Guide
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
                onClick={() => navigate('/growth-survey')}
              >
                Unlock Your Free Custom Growth Guide
                <ArrowRight className="ml-2" size={20} />
              </button>
              <button 
                className="btn-secondary btn-large" 
                onClick={() => document.getElementById('process').scrollIntoView({ behavior: 'smooth' })}
              >
                See Our Process
              </button>
            </div>
          </div>
        </div>
      </section>

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

      {/* Services Section - Three Pillars */}
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-header" id="section-services">
            <h2 className={`section-title ${isVisible['section-services'] ? 'fade-in-up' : ''}`}>
              Three Pillars of Growth
            </h2>
            <p className={`section-subtitle ${isVisible['section-services'] ? 'fade-in-up' : ''}`}>
              Comprehensive systems engineered for scale
            </p>
          </div>
          <div className="pillars-grid">
            {servicePillars.map((pillar, index) => (
              <div 
                key={index} 
                className={`pillar-card glass-card ${isVisible['section-services'] ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Align -> Diagnose -> Design -> Deliver */}
      <section className="process-section" id="process">
        <div className="container">
          <div className="section-header" id="section-process">
            <h2 className={`section-title ${isVisible['section-process'] ? 'fade-in-up' : ''}`}>
              Our Process
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
              Get your free custom growth guide. Discover where revenue is leaking 
              and what systems will capture it.
            </p>
            <button 
              data-testid="cta-btn"
              className="btn-primary btn-large glow-on-hover" 
              onClick={() => navigate('/growth-survey')}
            >
              Unlock Your Free Custom Growth Guide
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <TrendingUp className="logo-icon growth-icon" size={20} />
                <span className="we-text">we</span><span className="roi-text">ROI</span>
              </div>
              <p className="footer-tagline">Growth Systems Engineered for Scale</p>
              <div className="footer-social">
                <a href="https://instagram.com/weroi.co" target="_blank" rel="noopener noreferrer" className="social-link">
                  <Instagram size={20} />
                </a>
                <a href="mailto:contact.weroi@gmail.com" className="social-link">
                  <Mail size={20} />
                </a>
                <a href="https://wa.me/18761234567" target="_blank" rel="noopener noreferrer" className="social-link">
                  <Phone size={20} />
                </a>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-heading">Services</h4>
                <a href="#services" className="footer-link">AI Audit & Transformation</a>
                <a href="#services" className="footer-link">Growth Systems</a>
                <a href="#services" className="footer-link">Scale Partnerships</a>
              </div>
              <div className="footer-column">
                <h4 className="footer-heading">Company</h4>
                <a href="#process" className="footer-link">Our Process</a>
                <a href="#reviews" className="footer-link">Results</a>
                <button onClick={() => navigate('/growth-survey')} className="footer-link" style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, textAlign: 'left' }}>Get Growth Guide</button>
              </div>
              <div className="footer-column">
                <h4 className="footer-heading">Contact</h4>
                <div className="footer-contact">
                  <p className="footer-link">@weroi.co</p>
                  <p className="footer-link">contact.weroi@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 weROI. Engineered for Growth.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
