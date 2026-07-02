import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { PROCESSING_STEPS } from '../../data/growthiqConstants';

export default function GrowthIQProcessing({ onComplete }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers = PROCESSING_STEPS.map((_, i) =>
      setTimeout(() => setActiveIndex(i), i * 900)
    );
    const finish = setTimeout(() => {
      setDone(true);
      setTimeout(onComplete, 600);
    }, PROCESSING_STEPS.length * 900 + 400);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [onComplete]);

  return (
    <div className="giq-processing" role="status" aria-live="polite">
      <div className="giq-processing-inner">
        <motion.div
          className="giq-processing-ring"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="giq-processing-ring-inner" />
        </motion.div>

        <h2 className="giq-processing-title">GrowthIQ™ is analyzing your business</h2>
        <p className="giq-processing-sub">Building your personalized growth assessment...</p>

        <ul className="giq-processing-steps">
          {PROCESSING_STEPS.map((label, i) => {
            const isActive = i === activeIndex && !done;
            const isComplete = i < activeIndex || done;
            return (
              <motion.li
                key={label}
                className={`giq-processing-step${isActive ? ' is-active' : ''}${isComplete ? ' is-done' : ''}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {isComplete ? (
                  <CheckCircle2 size={18} className="giq-step-icon done" />
                ) : isActive ? (
                  <Loader2 size={18} className="giq-step-icon spin" />
                ) : (
                  <span className="giq-step-dot" />
                )}
                <span>{label}</span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
