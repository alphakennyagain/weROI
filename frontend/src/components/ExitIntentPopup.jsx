import React, { useState, useEffect } from 'react';
import { X, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExitIntentPopup = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('exitPopupShown');
    if (popupShown) {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e) => {
      // Only trigger when mouse leaves from the top
      if (e.clientY <= 0 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    // Add delay before enabling exit intent
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000); // 5 second delay

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasTriggered]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL || '';
      const response = await fetch(`${API_URL}/api/leads/guide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        sessionStorage.setItem('guideFormData', JSON.stringify(formData));
        setIsVisible(false);
        navigate('/thank-you?type=guide');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Still navigate on error for demo
      sessionStorage.setItem('guideFormData', JSON.stringify(formData));
      setIsVisible(false);
      navigate('/thank-you?type=guide');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="exit-popup-overlay" onClick={handleClose}>
      <div className="exit-popup-content glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={handleClose} data-testid="close-popup-btn">
          <X size={24} />
        </button>

        <div className="popup-layout">
          {/* Left Side - 3D Book Mockup */}
          <div className="popup-visual">
            <div className="book-mockup">
              <div className="book-cover">
                <div className="book-spine"></div>
                <div className="book-front">
                  <div className="book-content">
                    <BookOpen size={32} className="book-icon" />
                    <h4>weROI</h4>
                    <p>Growth Guide</p>
                    <span className="book-subtitle">$0 to $1M Blueprint</span>
                  </div>
                </div>
                <div className="book-pages"></div>
              </div>
              <div className="book-shadow"></div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="popup-form-section">
            <h2 className="popup-headline">
              Don't leave your growth<br />
              <span className="gradient-text">to chance.</span>
            </h2>
            <p className="popup-subtext">
              Download our Custom Tailored Guide to Scale your Business
              <span className="highlight"> ($0 to $1M Blueprint)</span>
            </p>

            <form onSubmit={handleSubmit} className="popup-form">
              <div className="popup-field">
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`popup-input ${errors.name ? 'error' : ''}`}
                  data-testid="popup-name-input"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              <div className="popup-field">
                <input
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`popup-input ${errors.email ? 'error' : ''}`}
                  data-testid="popup-email-input"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <button 
                type="submit" 
                className="btn-primary popup-submit glow-on-hover"
                disabled={isSubmitting}
                data-testid="popup-submit-btn"
              >
                {isSubmitting ? 'Sending...' : 'Get My Free Guide'}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="popup-disclaimer">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
