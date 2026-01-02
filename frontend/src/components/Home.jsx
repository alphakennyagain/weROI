import React, { useEffect, useState } from 'react';
import { ArrowRight, TrendingUp, Globe, Zap, Users, CheckCircle2, XCircle, Calendar, Instagram, Mail, Phone } from 'lucide-react';

const AnimatedGrid = () => {
  return (
    <div className="animated-grid-bg">
      <div className="grid-overlay"></div>
    </div>
  );
};

const Home = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
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

  const services = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Brand Scaling Systems',
      description: 'Digital infrastructure that supports growth and builds long-term brand equity.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'High-Conversion Websites',
      description: 'Websites built to convert visitors into customers, not just look pretty.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Local SEO Foundations',
      description: 'Get discovered on Google and Maps. Be found when customers are searching.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Lead Capture & Automation',
      description: 'Forms, booking, follow-ups, and pipelines that work while you sleep.'
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
      quote: "WeScale transformed how we attract customers. Our booking rate tripled in 2 months.",
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
      
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="container nav-content">
          <div className="logo">WeScale</div>
          <div className="nav-links">
            <a href="#services" className="nav-link">Services</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#reviews" className="nav-link">Reviews</a>
            <button className="btn-primary" onClick={() => document.getElementById('book-call').scrollIntoView({ behavior: 'smooth' })}>
              Book a Call
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="section-hero">
        <div className="container">
          <div className={`hero-content ${isVisible['section-hero'] ? 'fade-in-up' : ''}`}>
            <h1 className="hero-title">
              We scale local businesses into trusted, revenue-ready brands.
            </h1>
            <p className="hero-subtitle">
              We build digital systems that attract customers, convert leads, and help your business grow — without guesswork.
            </p>
            <div className="hero-cta-group">
              <button className="btn-primary btn-large" onClick={() => document.getElementById('book-call').scrollIntoView({ behavior: 'smooth' })}>
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

      {/* Authority Section */}
      <section className="authority-section" id="section-authority">
        <div className="container">
          <div className={`authority-grid ${isVisible['section-authority'] ? 'fade-in-up' : ''}`}>
            <div className="authority-card">
              <div className="authority-stat">50+</div>
              <div className="authority-label">Businesses Supported</div>
            </div>
            <div className="authority-card">
              <div className="authority-badge">Built for Local Businesses</div>
            </div>
            <div className="authority-card">
              <div className="authority-stat">100+</div>
              <div className="authority-label">Systems Deployed</div>
            </div>
            <div className="authority-card">
              <div className="authority-badge">Systems Over Shortcuts</div>
            </div>
            <div className="authority-card">
              <div className="authority-stat">85+</div>
              <div className="authority-label">Websites Built</div>
            </div>
            <div className="authority-card">
              <div className="authority-badge">Designed to Convert</div>
            </div>
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
                className={`service-card ${isVisible['section-services'] ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
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
                className={`step-card ${isVisible['section-how'] ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
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
            </div>
            <div className="lead-visual-image">
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
                className={`testimonial-card ${isVisible['section-reviews'] ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-business">{testimonial.business}</div>
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
            Is WeScale Right For You?
          </h2>
          <div className="who-grid">
            <div className={`who-card who-for ${isVisible['section-who'] ? 'fade-in-up' : ''}`}>
              <h3 className="who-title">✓ This Is For You If:</h3>
              <ul className="who-list">
                <li><CheckCircle2 size={20} /> You're a local business ready to grow</li>
                <li><CheckCircle2 size={20} /> You want a system, not just a website</li>
                <li><CheckCircle2 size={20} /> You're serious about attracting more customers</li>
                <li><CheckCircle2 size={20} /> You're willing to invest in long-term growth</li>
                <li><CheckCircle2 size={20} /> You value professionalism and results</li>
              </ul>
            </div>
            <div className={`who-card who-not ${isVisible['section-who'] ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.1s' }}>
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

      {/* Book a Call Section */}
      <section className="book-section" id="book-call">
        <div className="container">
          <div className="section-header" id="section-book">
            <h2 className={`section-title text-center ${isVisible['section-book'] ? 'fade-in-up' : ''}`}>
              Ready to Scale Your Business the Right Way?
            </h2>
            <p className={`section-subtitle text-center ${isVisible['section-book'] ? 'fade-in-up' : ''}`}>
              Book a free 30-minute strategy call. No pressure. Just clarity.
            </p>
          </div>
          <div className={`calendly-container ${isVisible['section-book'] ? 'fade-in-up' : ''}`}>
            <div className="calendly-placeholder">
              <Calendar size={48} />
              <p className="calendly-text">Schedule Your Free Strategy Call</p>
              <a 
                href="https://calendly.com/your-username" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary btn-large"
              >
                Open Calendar
              </a>
              <p className="reassurance-text">No pressure. Just clarity.</p>
              <p className="calendly-note">Replace with your Calendly link in Home.jsx</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">WeScale</div>
              <p className="footer-tagline">Brand Scaling for Local Businesses</p>
              <div className="footer-social">
                <a href="https://instagram.com/wescale.jm" target="_blank" rel="noopener noreferrer" className="social-link">
                  <Instagram size={20} />
                </a>
                <a href="mailto:hello@wescale.com" className="social-link">
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
                <a href="#book-call" className="footer-link">Book a Call</a>
              </div>
              <div className="footer-column">
                <h4 className="footer-heading">Contact</h4>
                <div className="footer-contact">
                  <p className="footer-link">@wescale.jm</p>
                  <p className="footer-link">(876) 123-4567</p>
                  <p className="footer-link">hello@wescale.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 WeScale. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;