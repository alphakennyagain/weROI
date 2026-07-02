import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, X, Sparkles, ArrowRight, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '../lib/apiConfig';
import { GROWTHIQ_BRAND } from '../data/growthiqConstants';
import './GrowthIQ.css';

const QUICK_REPLIES = [
  {
    q: `What is ${GROWTHIQ_BRAND}?`,
    a: `${GROWTHIQ_BRAND} is weROI's free AI-powered digital growth assessment. Answer a few questions about your business and get an instant personalized report with scores, priorities, and a growth roadmap.`,
  },
  {
    q: 'How long does it take?',
    a: 'About 3 to 5 minutes. Your progress saves automatically. Close the tab anytime and you will pick up right where you left off.',
  },
  {
    q: 'Is it really free?',
    a: `Yes. The ${GROWTHIQ_BRAND} report is completely free with no obligation. After your report, you can optionally request a complimentary expert review from the weROI team.`,
  },
  {
    q: 'What is the expert review?',
    a: `After your free ${GROWTHIQ_BRAND} report, you can request a complimentary expert review. The weROI team may validate findings, share deeper strategy, and in some cases provide visual concepts or website ideas so you can see what working with weROI looks like. Provided at our discretion, not guaranteed.`,
  },
  {
    q: 'What services does weROI offer?',
    a: 'weROI is a digital growth agency in Jamaica. We build websites, SEO, marketing funnels, CRM systems, automation, and custom software for businesses that want measurable ROI.',
  },
];

const FAQ_MATCH = [
  { keys: ['free', 'cost', 'price'], a: QUICK_REPLIES[2].a },
  { keys: ['long', 'minute', 'time'], a: QUICK_REPLIES[1].a },
  { keys: ['growthiq', 'what is', 'assessment'], a: QUICK_REPLIES[0].a },
  { keys: ['expert', 'review', 'mockup'], a: QUICK_REPLIES[3].a },
  { keys: ['service', 'weroi', 'agency'], a: QUICK_REPLIES[4].a },
];

function localFaqAnswer(text) {
  const lower = text.toLowerCase();
  const hit = FAQ_MATCH.find((f) => f.keys.some((k) => lower.includes(k)));
  return hit?.a || null;
}

export default function GrowthIQChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Hi! I'm the ${GROWTHIQ_BRAND} assistant. Ask me anything about the free assessment, expert review, or weROI services.`,
    },
  ]);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = getApiUrl();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (location.pathname === '/admin' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const goAssessment = () => {
    setOpen(false);
    if (location.pathname === '/growth-preview') {
      document.getElementById('giq-assessment-form')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/growth-preview');
    }
  };

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    const local = localFaqAnswer(trimmed);
    if (local) {
      setMessages((prev) => [...prev, { role: 'bot', text: local }]);
      setLoading(false);
      return;
    }

    if (!apiUrl) {
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: `Start your free ${GROWTHIQ_BRAND} assessment to get your personalized growth score and roadmap in minutes.`,
      }]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/growthiq/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error('chat failed');
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply || 'Try the free assessment at /growth-preview for your personalized report.' }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: localFaqAnswer(trimmed) || `I can help with ${GROWTHIQ_BRAND}, the free assessment, and weROI services. Start your free assessment anytime.`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = (item) => sendMessage(item.q);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
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
            aria-label={`${GROWTHIQ_BRAND} assistant`}
          >
            <div className="giq-chat-header">
              <div>
                <Sparkles size={16} />
                <span>{GROWTHIQ_BRAND} Assistant</span>
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
              {loading && <div className="giq-chat-msg giq-chat-msg--bot giq-chat-typing">Thinking…</div>}
              <div ref={bottomRef} />
            </div>
            <div className="giq-chat-quick">
              {QUICK_REPLIES.slice(0, 4).map((item) => (
                <button key={item.q} type="button" onClick={() => handleQuick(item)} disabled={loading}>
                  {item.q}
                </button>
              ))}
            </div>
            <form className="giq-chat-form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="giq-chat-input"
                placeholder={`Ask anything about ${GROWTHIQ_BRAND}…`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                disabled={loading}
                aria-label="Chat message"
              />
              <button type="submit" className="giq-chat-send" disabled={loading || !input.trim()} aria-label="Send">
                <Send size={16} />
              </button>
            </form>
            <button type="button" className="giq-chat-cta" onClick={goAssessment}>
              Get My Free Audit <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className="giq-chat-fab"
        onClick={() => setOpen(!open)}
        aria-label={open ? `Close ${GROWTHIQ_BRAND} chat` : `Open ${GROWTHIQ_BRAND} chat`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid="giq-chat-fab"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>
    </>
  );
}
