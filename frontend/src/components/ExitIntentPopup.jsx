import React, { useState, useEffect, useCallback } from 'react';
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
          page: '/',
          referrer: document.referrer || null,
          session_id: sessionId
        })
      });
    } catch (err) {
      console.log('Analytics tracking failed:', err);
    }
  };

  const showPopup = useCallback(() => {
    if (!hasTriggered) {
      setIsVisible(true);
      setHasTriggered(true);
      sessionStorage.setItem('exitPopupShown', 'true');
      // Track popup shown event
      trackEvent('popup_shown');
    }
  }, [hasTriggered]);

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('exitPopupShown');
    if (popupShown) {
      setHasTriggered(true);
      return;
    }

    // TRIGGER 1: Time-based - Show after 5 seconds
    const timeoutId = setTimeout(() => {
      showPopup();
    }, 5000);

    // TRIGGER 2: Exit intent for Desktop (mouse leaves window top)
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    // TRIGGER 3: Mobile back/swipe detection (history state)
    const handlePopState = () => {
      showPopup();
      // Push state back to prevent actual navigation
      window.history.pushState(null, '', window.location.href);
    };

    // TRIGGER 4: Mobile scroll up detection (at top of page)
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // If user scrolls up aggressively at top of page
      if (currentScrollY < 50 && lastScrollY > currentScrollY && lastScrollY - currentScrollY > 30) {
        showPopup();
      }
      lastScrollY = currentScrollY;
    };

    // TRIGGER 5: Touch end at top (mobile swipe down)
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      // Swipe down from top of screen
      if (touchStartY < 100 && touchEndY - touchStartY > 100) {
        showPopup();
      }
    };

    // Add history state for mobile back detection
    window.history.pushState(null, '', window.location.href);

    // Add event listeners with delay
    const listenerTimeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('scroll', handleScroll, { passive: true });
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(listenerTimeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [hasTriggered, showPopup]);

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
      const response = await fetch(`${API_URL}/api/leads/guide`, {
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
        sessionStorage.setItem('guideFormData', JSON.stringify(formData));
        setIsVisible(false);
        navigate('/thank-you?type=guide');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
