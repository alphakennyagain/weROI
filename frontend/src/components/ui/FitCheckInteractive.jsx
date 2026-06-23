import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const FOR_ITEMS = [
  'You need a website, custom app, funnel, or booking system that actually converts',
  'You want AI workflows that save time on follow up, quotes, and admin',
  'You are ready to connect ads, CRM, and sales into one growth system',
  'You care about revenue numbers, not just likes and impressions',
  'You want one partner for build, marketing, and ongoing optimization',
  'You run a Jamaican business and want work that scales beyond Kingston',
];

const NOT_ITEMS = [
  'You only want a cheap template with no strategy behind it',
  'You need a logo refresh but no interest in leads or sales systems',
  'You are not ready to share numbers or implement recommendations',
  'You want vanity metrics without tying work to revenue',
  'You prefer juggling five freelancers instead of one accountable partner',
];

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: 12,
    transition: { duration: 0.2 },
  },
};

export default function FitCheckInteractive() {
  const [activeTab, setActiveTab] = useState('for');
  const items = activeTab === 'for' ? FOR_ITEMS : NOT_ITEMS;
  const isFor = activeTab === 'for';

  return (
    <div className="fit-check-interactive" data-testid="fit-check-interactive">
      <div className="fit-check-interactive__tabs" role="tablist" aria-label="Fit check">
        <button
          type="button"
          role="tab"
          aria-selected={isFor}
          className={`fit-check-interactive__tab${isFor ? ' is-active' : ''}`}
          onClick={() => setActiveTab('for')}
        >
          <Check size={16} aria-hidden="true" />
          For you
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isFor}
          className={`fit-check-interactive__tab fit-check-interactive__tab--not${!isFor ? ' is-active' : ''}`}
          onClick={() => setActiveTab('not')}
        >
          <X size={16} aria-hidden="true" />
          Not for you
        </button>
      </div>

      <div
        className={`fit-check-interactive__panel${isFor ? '' : ' is-not'}`}
        role="tabpanel"
      >
        <div className="fit-check-interactive__panel-head">
          <span className="fit-check-interactive__key">{isFor ? 'For' : 'Not For'}</span>
          <h3 className="fit-check-interactive__title">
            {isFor ? 'We build growth systems for' : 'This is not for'}
          </h3>
        </div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={activeTab}
            className="fit-check-interactive__list"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {items.map((item) => (
              <motion.li key={item} variants={itemVariants}>
                <span className="fit-check-interactive__marker" aria-hidden="true">
                  {isFor ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                </span>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
