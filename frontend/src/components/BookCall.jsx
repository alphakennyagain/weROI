import React, { useState, useEffect } from 'react';
import { InlineWidget } from 'react-calendly';
import { ChevronDown, CheckCircle, XCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookCall = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    businessStage: '',
    readiness: ''
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBusinessStageSelect = (value) => {
    setAnswers({ ...answers, businessStage: value });
    setTimeout(() => setStep(2), 300);
  };

  const handleReadinessSelect = (value) => {
    setAnswers({ ...answers, readiness: value });
    
    // Check if qualified
    const qualifiedBusinessStage = [
      'Consistent sales, ready to grow',
      'Established business, want better ROI'
    ].includes(answers.businessStage);
    
    const qualifiedReadiness = [
      'Ready now',
      'Ready within 30 days'
    ].includes(value);
    
    setTimeout(() => {
      if (qualifiedBusinessStage && qualifiedReadiness) {
        setShowCalendar(true);
      } else {
        setShowFallback(true);
      }
    }, 300);
  };

  const businessStageOptions = [
    'Just getting started',
    'Making sales but growth is inconsistent',
    'Consistent sales, ready to grow',
    'Established business, want better ROI'
  ];

  const readinessOptions = [
    'Ready now',
    'Ready within 30 days',
    'Open but need more clarity',
    'Not ready yet'
  ];

  return (
    <div className="book-call-page">
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="container nav-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Sparkles className="logo-icon" size={20} />
            WeScale
          </div>
          <button className="btn-ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
        </div>
      </nav>

      <div className="book-call-container">
        <div className="container">
          {!showCalendar && !showFallback && (
            <div className="qualification-section">
              <div className="qualification-header fade-in-up">
                <h1 className="qualification-title">Book Your Free Strategy Call</h1>
                <p className="qualification-subtitle">
                  Let's make sure this call is the right fit for where your business is right now.
                </p>
              </div>

              {/* Question 1 */}
              {step >= 1 && (
                <div className="question-card glass-card fade-in-up">
                  <div className="question-number">Question 1 of 2</div>
                  <h2 className="question-title">Which best describes your business right now?</h2>
                  <div className="options-grid">
                    {businessStageOptions.map((option, index) => (
                      <button
                        key={index}
                        className={`option-button ${
                          answers.businessStage === option ? 'selected' : ''
                        }`}
                        onClick={() => handleBusinessStageSelect(option)}
                      >
                        <span className="option-text">{option}</span>
                        {answers.businessStage === option && (
                          <CheckCircle className="option-check" size={20} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 2 */}
              {step >= 2 && (
                <div className="question-card glass-card fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="question-number">Question 2 of 2</div>
                  <h2 className="question-title">
                    If we could reliably increase your revenue or ROI, how ready are you to invest in growth?
                  </h2>
                  <div className="options-grid">
                    {readinessOptions.map((option, index) => (
                      <button
                        key={index}
                        className={`option-button ${
                          answers.readiness === option ? 'selected' : ''
                        }`}
                        onClick={() => handleReadinessSelect(option)}
                      >
                        <span className="option-text">{option}</span>
                        {answers.readiness === option && (
                          <CheckCircle className="option-check" size={20} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Show Calendar for Qualified Leads */}
          {showCalendar && (
            <div className="calendar-section fade-in-up">
              <div className="calendar-header">
                <CheckCircle size={48} className="success-icon" />
                <h2 className="calendar-title">Perfect! Let's Schedule Your Call</h2>
                <p className="calendar-subtitle">
                  Choose a time that works best for you. We'll discuss your growth goals and create a custom strategy.
                </p>
              </div>
              <div className="calendly-widget-wrapper">
                <InlineWidget
                  url={`https://calendly.com/wescalejm/30min?a1=${encodeURIComponent(
                    answers.businessStage
                  )}&a2=${encodeURIComponent(answers.readiness)}`}
                  styles={{
                    height: '700px',
                    minWidth: '320px'
                  }}
                  pageSettings={{
                    backgroundColor: '111113',
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: 'DAFF01',
                    textColor: 'ffffff'
                  }}
                  prefill={{
                    customAnswers: {
                      a1: answers.businessStage,
                      a2: answers.readiness
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Fallback Message for Unqualified Leads */}
          {showFallback && (
            <div className="fallback-section fade-in-up">
              <div className="fallback-card glass-card">
                <XCircle size={64} className="fallback-icon" />
                <h2 className="fallback-title">Thanks for Your Interest</h2>
                <p className="fallback-text">
                  Right now, this call is best for businesses that are already making consistent sales and ready to invest in growth.
                </p>
                <p className="fallback-text">
                  We'll send you helpful resources to help you get to that stage.
                </p>
                <div className="fallback-actions">
                  <button className="btn-primary btn-large" onClick={() => navigate('/')}>
                    Return to Home
                  </button>
                  <button
                    className="btn-secondary btn-large"
                    onClick={() => {
                      setStep(1);
                      setAnswers({ businessStage: '', readiness: '' });
                      setShowFallback(false);
                    }}
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCall;