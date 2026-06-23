import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import './FaqSection.css';

const FAQ_ITEMS = [
  {
    id: 'what-we-do',
    question: 'What does weROI actually do?',
    answer:
      'We build growth systems for Jamaican businesses: websites, web and mobile apps, funnels, paid media, CRM setup, and AI workflows. Everything ties back to revenue you can track, not vanity metrics.',
  },
  {
    id: 'timeline',
    question: 'How long does a project take?',
    answer:
      'A landing page, simple website, or app usually takes about 1 to 2 weeks. A full project with integrations, funnels, or a complete growth system runs about 3 to 4 weeks. We agree on the timeline upfront so you know what to expect before we start.',
  },
  {
    id: 'small-business',
    question: 'Do you work with small businesses?',
    answer:
      'Yes. We work with solo operators, local shops, and growing teams across Jamaica. If you want a real system behind your marketing and sales, not just a pretty site, we are a good fit.',
  },
  {
    id: 'free-audit',
    question: 'What is the free growth audit?',
    answer:
      'It is a no-cost review of your website, ads, follow up, and tech stack. We map where leads leak, what is costing you time, and the top fixes ranked by revenue impact. You get a clear action plan whether you hire us or not.',
  },
  {
    id: 'mobile-apps',
    question: 'Do you build mobile apps?',
    answer:
      'Yes. We build mobile apps and progressive web apps when your business needs them: booking tools, customer portals, internal dashboards, and field apps. We recommend mobile only when it solves a real workflow problem.',
  },
  {
    id: 'google-search',
    question: 'Do you help with Google search?',
    answer:
      'Yes. We optimize your website, local SEO, and Google Business Profile so you rank higher when people search for what you offer. The goal is top visibility on Google for your niche, so customers find you before the competition.',
  },
  {
    id: 'pricing',
    question: 'How much does it cost?',
    answer:
      'Projects start around JMD 150,000 for focused builds and scale with scope. Ongoing growth partnerships are quoted monthly based on channels and deliverables. We price against outcomes, not hourly rates, and share a clear proposal before any work begins.',
  },
  {
    id: 'different',
    question: 'What makes you different from other agencies?',
    answer:
      'We are one partner for build, marketing, and AI under one roof. Every engagement runs through a four-phase framework with measurable milestones. You own the systems we deploy, and we stay accountable to the numbers, not just the deliverables.',
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  const panelId = `faq-panel-${item.id}`;
  const triggerId = `faq-trigger-${item.id}`;

  return (
    <div className={`faq-item${isOpen ? ' is-open' : ''}`}>
      <button
        type="button"
        id={triggerId}
        className="faq-item__trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="faq-item__question">{item.question}</span>
        <span className="faq-item__icon" aria-hidden="true">
          <ChevronDown size={20} strokeWidth={2} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            className="faq-item__panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="body-sm faq-item__answer">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const [openId, setOpenId] = useState(FAQ_ITEMS[0].id);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="section bg-paper section-glow section-glow--right faq-section" id="faq" data-testid="faq-section">
      <div className="container">
        <div className="section-head">
          <div className="section-head-left">
            <span className="eyebrow">FAQ</span>
            <ScrollReveal as="h2" className="heading" enableBlur={false} textClassName="heading">
              Common questions, straight answers.
            </ScrollReveal>
          </div>
          <div className="section-head-right">
            <ScrollReveal as="p" className="body" enableBlur blurStrength={3} textClassName="body">
              Straight talk for owners who want clarity before they commit. No jargon, no pressure.
            </ScrollReveal>
          </div>
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item) => (
            <FaqItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
