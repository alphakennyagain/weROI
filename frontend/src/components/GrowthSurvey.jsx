import React, { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GrowthSurvey = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    bottleneck: '',
    revenueGoal: '',
    currency: 'USD'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bottleneckOptions = [
    'Lead generation — not enough qualified prospects',
    'Conversion — leads don\'t turn into customers',
    'Operations — too much manual work, no systems',
    'Visibility — nobody knows we exist online',
    'Retention — customers don\'t come back',
    'All of the above — growth is stuck everywhere'
  ];

  const revenueOptions = [
    { label: 'Under 100K', value: 'under-100k' },
    { label: '100K - 500K', value: '100k-500k' },
    { label: '500K - 1M', value: '500k-1m' },
    { label: '1M - 5M', value: '1m-5m' },
    { label: '5M+', value: '5m-plus' }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'JMD', symbol: 'J$', name: 'Jamaican Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
  ];

  const handleBottleneckSelect = (value) => {
    setAnswers({ ...answers, bottleneck: value });
    setTimeout(() => setStep(2), 400);
  };

  const handleRevenueSelect = (value) => {
    setAnswers({ ...answers, revenueGoal: value });
  };

  const handleSubmit = () => {
    if (!answers.revenueGoal) return;
    setIsSubmitting(true);
    
    // Store answers in sessionStorage for the next page
    sessionStorage.setItem('growthSurveyAnswers', JSON.stringify(answers));
    
    setTimeout(() => {
      navigate('/struggling-to-scale');
    }, 800);
  };

  return (
    <div className="survey-page">
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

      <div className="survey-container">
        <div className="container">
          <div className="survey-content">
            {/* Progress indicator */}
            <div className="survey-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: step === 1 ? '50%' : '100%' }}
                ></div>
              </div>
              <span className="progress-text">Step {step} of 2</span>
            </div>

            {/* Header */}
            <div className="survey-header fade-in-up">
              <div className="survey-badge">
                <span className="badge-dot"></span>
                Free Growth Assessment
              </div>
              <h1 className="survey-title">
                Unlock Your Custom<br />
                <span className="gradient-text">Growth Guide</span>
              </h1>
              <p className="survey-subtitle">
                Answer two quick questions. Get a personalized roadmap to scale.
              </p>
            </div>

            {/* Question 1 */}
            {step >= 1 && (
              <div className="survey-question glass-card fade-in-up">
                <div className="question-label">Question 1</div>
                <h2 className="question-text">
                  What's your primary growth bottleneck right now?
                </h2>
                <div className="options-list">
                  {bottleneckOptions.map((option, index) => (
                    <button
                      key={index}
                      data-testid={`bottleneck-option-${index}`}
                      className={`survey-option ${answers.bottleneck === option ? 'selected' : ''}`}
                      onClick={() => handleBottleneckSelect(option)}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <span className="option-indicator">
                        {answers.bottleneck === option && (
                          <span className="indicator-dot"></span>
                        )}
                      </span>
                      <span className="option-label">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 2 */}
            {step >= 2 && (
              <div className="survey-question glass-card fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="question-label">Question 2</div>
                <h2 className="question-text">
                  What's your 12-month revenue goal?
                </h2>
                
                {/* Currency Selector */}
                <div className="currency-selector">
                  <label className="currency-label">Select your currency:</label>
                  <div className="currency-dropdown">
                    <select
                      data-testid="currency-select"
                      value={answers.currency}
                      onChange={(e) => setAnswers({ ...answers, currency: e.target.value })}
                      className="currency-select"
                    >
                      {currencies.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.symbol} {curr.code} — {curr.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="dropdown-icon" size={20} />
                  </div>
                </div>

                <div className="revenue-options">
                  {revenueOptions.map((option, index) => (
                    <button
                      key={index}
                      data-testid={`revenue-option-${index}`}
                      className={`revenue-option ${answers.revenueGoal === option.value ? 'selected' : ''}`}
                      onClick={() => handleRevenueSelect(option.value)}
                    >
                      <span className="revenue-symbol">
                        {currencies.find(c => c.code === answers.currency)?.symbol}
                      </span>
                      <span className="revenue-label">{option.label}</span>
                    </button>
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  data-testid="submit-survey-btn"
                  className={`btn-primary btn-large survey-submit glow-on-hover ${!answers.revenueGoal ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={!answers.revenueGoal || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading-text">Generating Your Guide...</span>
                  ) : (
                    <>
                      Get My Free Growth Guide
                      <ArrowRight className="ml-2" size={20} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthSurvey;
