import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, TrendingUp, Globe, Zap, Users, CheckCircle2, XCircle, Instagram, Mail, Phone } from 'lucide-react';
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

const CountUpStat = ({ end, label, delay = 0 }) => {
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
      <div className="authority-stat gradient-text">{count}+</div>
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

    // Gradually increase cursor glow brightness over time
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

  const services = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Brand Scaling Systems',
      description: 'Digital infrastructure that supports growth and builds long-term brand equity.',
      gradient: 'from-accent-1'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'High-Conversion Websites',
      description: 'Websites built to convert visitors into customers, not just look pretty.',
      gradient: 'from-accent-2'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Local SEO Foundations',
      description: 'Get discovered on Google and Maps. Be found when customers are searching.',
      gradient: 'from-accent-3'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Lead Capture & Automation',
      description: 'Forms, booking, follow-ups, and pipelines that work while you sleep.',
      gradient: 'from-accent-4'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Diagnose & Strategy',
      description: 'We analyze your business, identify gaps, and create a custom growth roadmap.'
    },
    {
      number: '02',
      title: 'Build the Digital System',
      description: 'We design and deploy your conversion-ready website and automation systems.'
    },
    {
      number: '03',
      title: 'Launch, Optimize, Scale',
      description: 'Go live, track results, refine performance, and watch your business grow.'
    }
  ];

  const testimonials = [
    {
      quote: "weROI transformed how we attract customers. Our booking rate tripled in 2 months.",
      name: 'Marcus Thompson',
      business: 'Elite Cuts Barbershop'
    },
    {
      quote: "Finally, a system that actually brings in leads. No more guessing, just results.",
      name: 'Sarah Chen',
      business: 'Tech Repair Pro'
    },
    {
      quote: "They built us a website that converts. Our phone hasn't stopped ringing since launch.",
      name: 'David Martinez',
      business: 'Martinez Legal Services'
    }
  ];

  return (
    <div className="home-container">
      <AnimatedGrid />
      
      {/* Cursor Glow Effect with Dynamic Opacity */}
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
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#reviews" className="nav-link">Reviews</a>
            <button className="btn-primary" onClick={() => navigate('/book-call')}>
              Book a Call
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
              Systems Over Shortcuts
            </div>
            <h1 className="hero-title">
              We scale local businesses into trusted, revenue-ready brands.
            </h1>
            <p className="hero-subtitle">
              We build digital systems that attract customers, convert leads, and help your business grow — without guesswork.
            </p>
            <div className="hero-cta-group">
              <button className="btn-primary btn-large glow-on-hover" onClick={() => navigate('/book-call')}>
                Book a Free Strategy Call
                <ArrowRight className="ml-2" size={20} />
              </button>
              <button className="btn-secondary btn-large" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>
                See How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Section - Only Stats with Count-Up Animation */}
      <section className="authority-section" id="section-authority">
        <div className="container">
          <div className={`authority-grid ${isVisible['section-authority'] ? 'fade-in-up' : ''}`}>
            <CountUpStat end={50} label="Businesses Supported" delay={0} />
            <CountUpStat end={100} label="Systems Deployed" delay={200} />
            <CountUpStat end={85} label="Websites Built" delay={400} />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-header" id="section-services">
            <h2 className={`section-title ${isVisible['section-services'] ? 'fade-in-up' : ''}`}>
              What We Build For You
            </h2>
            <p className={`section-subtitle ${isVisible['section-services'] ? 'fade-in-up' : ''}`}>
              Complete digital systems that turn your business into a customer magnet
            </p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`service-card glass-card ${isVisible['section-services'] ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="service-icon-glow"></div>
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <div className="section-header" id="section-how">
            <h2 className={`section-title ${isVisible['section-how'] ? 'fade-in-up' : ''}`}>
              How It Works
            </h2>
            <p className={`section-subtitle ${isVisible['section-how'] ? 'fade-in-up' : ''}`}>
              A proven 3-step system to scale your brand
            </p>
          </div>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`step-card glass-card ${isVisible['section-how'] ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="step-number gradient-text">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                <div className="step-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Visual */}
      <section className="lead-visual-section" id="section-lead-visual">
        <div className="container">
          <div className={`lead-visual-content ${isVisible['section-lead-visual'] ? 'fade-in-up' : ''}`}>
            <div className="lead-visual-text">
              <h2 className="section-title">Your Leads, Organized & Automated</h2>
              <p className="section-subtitle">
                Every contact captured, every follow-up automated, every opportunity tracked. This is what systematic growth looks like.
              </p>
              <div className="lead-stats">
                <div className="lead-stat-item">
                  <div className="stat-icon">⚡</div>
                  <div>Instant Capture</div>
                </div>
                <div className="lead-stat-item">
                  <div className="stat-icon">🎯</div>
                  <div>Smart Routing</div>
                </div>
                <div className="lead-stat-item">
                  <div className="stat-icon">📊</div>
                  <div>Real-time Tracking</div>
                </div>
              </div>
            </div>
            <div className="lead-visual-image glass-card">
              <div className="image-glow"></div>
              <img 
                src="https://customer-assets.emergentagent.com/job_local-scale/artifacts/25smaio8_image.png" 
                alt="Lead management system"
                className="data-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section" id="reviews">
        <div className="container">
          <div className="section-header" id="section-reviews">
            <h2 className={`section-title ${isVisible['section-reviews'] ? 'fade-in-up' : ''}`}>
              What Our Clients Say
            </h2>
            <p className={`section-subtitle ${isVisible['section-reviews'] ? 'fade-in-up' : ''}`}>
              Real results from real local businesses
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`testimonial-card glass-card ${isVisible['section-reviews'] ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="quote-icon">"</div>
                <p className="testimonial-quote">{testimonial.quote}</p>
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
              <h3 className="who-title">✓ This Is For You If:</h3>
              <ul className="who-list">
                <li><CheckCircle2 size={20} /> You're a local business ready to grow</li>
                <li><CheckCircle2 size={20} /> You want a system, not just a website</li>
                <li><CheckCircle2 size={20} /> You're serious about attracting more customers</li>
                <li><CheckCircle2 size={20} /> You're willing to invest in long-term growth</li>
                <li><CheckCircle2 size={20} /> You value professionalism and results</li>
              </ul>
            </div>
            <div className={`who-card glass-card who-not ${isVisible['section-who'] ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.1s' }}>
              <h3 className="who-title">✗ This Is NOT For You If:</h3>
              <ul className="who-list">
                <li><XCircle size={20} /> You're looking for cheap, template websites</li>
                <li><XCircle size={20} /> You want quick fixes without strategy</li>
                <li><XCircle size={20} /> You're not ready to invest in your business</li>
                <li><XCircle size={20} /> You expect results without implementation</li>
                <li><XCircle size={20} /> You're not serious about scaling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="section-cta">
        <div className="container">
          <div className={`cta-card glass-card ${isVisible['section-cta'] ? 'fade-in-up' : ''}`}>
            <h2 className="cta-title">Ready to Scale Your Business the Right Way?</h2>
            <p className="cta-subtitle">
              Book a free 30-minute strategy call. No pressure. Just clarity.
            </p>
            <button className="btn-primary btn-large glow-on-hover" onClick={() => navigate('/book-call')}>
              Book Your Strategy Call
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
              <p className="footer-tagline">Brand Scaling for Local Businesses</p>
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
                <a href="#services" className="footer-link">Brand Scaling</a>
                <a href="#services" className="footer-link">Web Design</a>
                <a href="#services" className="footer-link">Local SEO</a>
                <a href="#services" className="footer-link">Lead Capture</a>
              </div>
              <div className="footer-column">
                <h4 className="footer-heading">Company</h4>
                <a href="#how-it-works" className="footer-link">How It Works</a>
                <a href="#reviews" className="footer-link">Reviews</a>
                <button onClick={() => navigate('/book-call')} className="footer-link" style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, textAlign: 'left' }}>Book a Call</button>
              </div>
              <div className="footer-column">
                <h4 className="footer-heading">Contact</h4>
                <div className="footer-contact">
                  <p className="footer-link">@wescale.jm</p>
                  <p className="footer-link">(876) 123-4567</p>
                  <p className="footer-link">contact.weroi@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 weROI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;