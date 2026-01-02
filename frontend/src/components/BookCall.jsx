import React, { useState, useEffect } from 'react';
import { InlineWidget } from 'react-calendly';
import { CheckCircle, ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookCall = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    businessStage: '',
    readiness: ''
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({ min: '', max: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBusinessStageSelect = (value) => {
    setAnswers({ ...answers, businessStage: value });
    setTimeout(() => setStep(2), 300);
  };

  const handleReadinessSelect = (value) => {
    setAnswers({ ...answers, readiness: value });
    
    // Calculate date range based on readiness
    const today = new Date();
    let minDate, maxDate;
    
    if (value === 'Ready now') {
      // Today to 7 days from now
      minDate = today;
      maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 7);
    } else if (value === 'Ready within 30 days') {
      // Today to 30 days from now
      minDate = today;
      maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 30);
    } else {
      // Default: no restrictions (for other options)
      minDate = today;
      maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 60);
    }
    
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    setDateRange({
      min: formatDate(minDate),
      max: formatDate(maxDate)
    });
    
    setTimeout(() => {
      setShowCalendar(true);
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
            <TrendingUp className="logo-icon growth-icon" size={20} />
            <span>we<span className="roi-text">ROI</span></span>
          </div>
          <button className="btn-ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
        </div>
      </nav>

      <div className="book-call-container">
        <div className="container">
          {!showCalendar && (
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

          {/* Show Calendar for All Leads */}
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
                  )}&a2=${encodeURIComponent(answers.readiness)}&date_range_start=${dateRange.min}&date_range_end=${dateRange.max}`}
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
        </div>
      </div>
    </div>
  );
};

export default BookCall;