import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

export default function HelpTip({ text, label = 'More info' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <span className="giq-help-tip" ref={ref}>
      <button
        type="button"
        className="giq-help-btn"
        onClick={() => setOpen(!open)}
        aria-label={label}
        aria-expanded={open}
      >
        <HelpCircle size={14} />
      </button>
      {open && (
        <span className="giq-help-popover" role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}
