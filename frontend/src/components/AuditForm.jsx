import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, TrendingUp, CheckCircle, User, Phone, Mail, Building, Search, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuditForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company_name: '',
    website: '',
    how_found_us: ''
  });
  const [errors, setErrors] = useState({});

  const totalSteps = 6;

  const API_URL = process.env.REACT_APP_BACKEND_URL || '';
  const sessionId = sessionStorage.getItem('sessionId') || (() => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', id);
    return id;
  })();

  // Track analytics event
  const trackEvent = async (eventType) => {
    try {
      await fetch(`${API_URL}/api/analytics/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          page: '/audit',
          referrer: document.referrer || null,
          session_id: sessionId
        })
      });
    } catch (err) {
      console.log('Analytics tracking failed:', err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Track audit form start
    trackEvent('audit_form_start');
    trackEvent('page_view');
  }, []);

  const howFoundOptions = [
    'Google Search',
    'Social Media (Instagram, LinkedIn, etc.)',
    'Referral from a friend or colleague',
    'Podcast or YouTube',
    'Online Advertisement',
    'Other'
  ];

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        break;
      case 2:
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) newErrors.phone = 'Enter a valid phone number';
        break;
      case 3:
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
        break;
      case 4:
        if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
        break;
      case 5:
        // Website is optional, no validation needed
        break;
      case 6:
        if (!formData.how_found_us) newErrors.how_found_us = 'Please select an option';
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/leads/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          referrer: document.referrer || null
        }),
      });
      
      if (response.ok) {
        // Store data for thank you page
        sessionStorage.setItem('auditFormData', JSON.stringify(formData));
        navigate('/thank-you?type=audit');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Still navigate on error for demo purposes
      sessionStorage.setItem('auditFormData', JSON.stringify(formData));
      navigate('/thank-you?type=audit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const getStepIcon = (stepNum) => {
    const icons = {
      1: <User size={24} />,
      2: <Phone size={24} />,
      3: <Mail size={24} />,
      4: <Building size={24} />,
      5: <Search size={24} />
    };
    return icons[stepNum];
  };

  const getStepTitle = (stepNum) => {
    const titles = {
      1: "What's your name?",
      2: "What's your phone number?",
      3: "What's your email?",
      4: "What's your company name?",
      5: "How did you find us?"
    };
    return titles[stepNum];
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-field">
            <input
              type="text"
              data-testid="audit-name-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNext()}
              className={`form-input ${errors.name ? 'error' : ''}`}
              autoFocus
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
        );
      case 2:
        return (
          <div className="form-field">
            <input
              type="tel"
              data-testid="audit-phone-input"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNext()}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              autoFocus
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
        );
      case 3:
        return (
          <div className="form-field">
            <input
              type="email"
              data-testid="audit-email-input"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNext()}
              className={`form-input ${errors.email ? 'error' : ''}`}
              autoFocus
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        );
      case 4:
        return (
          <div className="form-field">
            <input
              type="text"
              data-testid="audit-company-input"
              placeholder="Enter your company name"
              value={formData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNext()}
              className={`form-input ${errors.company_name ? 'error' : ''}`}
              autoFocus
            />
            {errors.company_name && <span className="error-text">{errors.company_name}</span>}
          </div>
        );
      case 5:
        return (
          <div className="form-field">
            <div className="how-found-options">
              {howFoundOptions.map((option, index) => (
                <button
                  key={index}
                  data-testid={`how-found-option-${index}`}
                  className={`how-found-option ${formData.how_found_us === option ? 'selected' : ''}`}
                  onClick={() => handleInputChange('how_found_us', option)}
                >
                  <span className="option-radio">
                    {formData.how_found_us === option && <span className="radio-dot"></span>}
                  </span>
                  {option}
                </button>
              ))}
            </div>
            {errors.how_found_us && <span className="error-text">{errors.how_found_us}</span>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="audit-form-page">
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

      <div className="audit-form-container">
        <div className="container">
          {/* Progress Bar */}
          <div className="form-progress">
            <div className="progress-bar-wrapper">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
            <div className="progress-steps">
              {[1, 2, 3, 4, 5].map((s) => (
                <div 
                  key={s} 
                  className={`progress-step ${s <= step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
                >
                  {s < step ? <CheckCircle size={16} /> : s}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="form-content glass-card fade-in-up">
            <div className="step-indicator">
              <div className="step-icon">{getStepIcon(step)}</div>
              <span className="step-count">Step {step} of {totalSteps}</span>
            </div>
            
            <h1 className="form-title">{getStepTitle(step)}</h1>
            
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {step > 1 && (
                <button 
                  className="btn-ghost form-btn-prev"
                  onClick={handlePrev}
                  data-testid="prev-step-btn"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              )}
              
              {step < totalSteps ? (
                <button 
                  className="btn-primary form-btn-next glow-on-hover"
                  onClick={handleNext}
                  data-testid="next-step-btn"
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button 
                  className={`btn-primary form-btn-submit glow-on-hover ${isSubmitting ? 'loading' : ''}`}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  data-testid="submit-audit-btn"
                >
                  {isSubmitting ? 'Submitting...' : 'Claim My Free Audit'}
                  {!isSubmitting && <ArrowRight size={20} />}
                </button>
              )}
            </div>
          </div>

          {/* Trust Badge */}
          <div className="trust-badge fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CheckCircle size={16} className="trust-icon" />
            <span>100% Free • No Obligation • Results in 48 Hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditForm;
