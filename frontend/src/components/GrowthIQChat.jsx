import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './GrowthIQ.css';

const QUICK_REPLIES = [
  {
    q: 'What is GrowthIQ™?',
    a: 'GrowthIQ™ is weROI\'s free AI-powered digital growth assessment. Answer a few questions about your business and get an instant personalized report with scores, priorities, and a growth roadmap.',
  },
  {
    q: 'How long does it take?',
    a: 'About 3 to 5 minutes. Your progress saves automatically, so you can pause and resume anytime.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes. The GrowthIQ™ report is completely free with no obligation. After your report, you can optionally request a complimentary expert review from our team.',
  },
  {
    q: 'What do I get in the report?',
    a: 'An overall GrowthIQ score with letter grade, category breakdowns (website, SEO, brand, leads, and more), quick wins, top opportunities, and a suggested 30/60/90 day roadmap.',
  },
  {
    q: 'Do you analyze my website?',
    a: 'If you provide your website URL, GrowthIQ™ fetches your homepage and analyzes title tags, headings, navigation, CTAs, and basic SEO signals. We never invent data we cannot verify.',
  },
  {
    q: 'What services does weROI offer?',
    a: 'weROI is a digital growth agency in Jamaica. We build websites, SEO, marketing funnels, CRM systems, automation, and custom software for businesses that want measurable ROI.',
  },
  {
    q: 'What is the expert review?',
    a: 'After your free report, you can request a complimentary expert review. Our team validates findings against your live digital presence. Reviews are offered for a limited number of businesses each week, at our discretion.',
  },
  {
    q: 'Will you sell me something?',
    a: 'No pressure. The assessment and report are free. An expert review is optional. We only follow up if you request it.',
  },
];

export default function GrowthIQChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi! I\'m the GrowthIQ™ assistant. Ask me about the free assessment, what\'s included, or how weROI can help your business grow online.',
    },
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/admin' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleQuick = (item) => {
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: item.q },
      { role: 'bot', text: item.a },
    ]);
  };

  const goAssessment = () => {
    setOpen(false);
    if (location.pathname === '/growth-preview') {
      document.getElementById('giq-assessment-form')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/growth-preview');
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="giq-chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="GrowthIQ assistant"
          >
            <div className="giq-chat-header">
              <div>
                <Sparkles size={16} />
                <span>GrowthIQ™ Assistant</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
                <X size={18} />
              </button>
            </div>
            <div className="giq-chat-messages">
              {messages.map((m, i) => (
                <div key={`${m.role}-${i}`} className={`giq-chat-msg giq-chat-msg--${m.role}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="giq-chat-quick">
              {QUICK_REPLIES.map((item) => (
                <button key={item.q} type="button" onClick={() => handleQuick(item)}>
                  {item.q}
                </button>
              ))}
            </div>
            <button type="button" className="giq-chat-cta" onClick={goAssessment}>
              Get My Free Assessment <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className="giq-chat-fab"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close GrowthIQ chat' : 'Open GrowthIQ chat'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid="giq-chat-fab"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>
    </>
  );
}
