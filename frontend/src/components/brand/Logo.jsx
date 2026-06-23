import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

/** Refined growth-line mark — dark card, hairline border, lime accent */
export function LogoIcon({ className = '' }) {
  return (
    <svg
      className={`logo-icon-svg ${className}`.trim()}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="8"
        fill="#141414"
        stroke="rgba(200, 245, 66, 0.28)"
        strokeWidth="1"
      />
      <line
        x1="7"
        y1="22.5"
        x2="25"
        y2="22.5"
        stroke="rgba(255, 255, 255, 0.08)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M7 21.5L12.5 15.5L17 17.5L25 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="9" r="1.75" fill="currentColor" />
    </svg>
  );
}

/**
 * weROI brand lockup — icon + wordmark with "ROI" in lime accent.
 * @param {'sm'|'md'|'lg'} size
 * @param {string} [to] — renders as react-router Link
 * @param {boolean} [wordmark=true]
 */
export default function Logo({
  size = 'md',
  to,
  onClick,
  className = '',
  wordmark = true,
  ...rest
}) {
  const classes = ['brand', 'logo', `logo--${size}`, className].filter(Boolean).join(' ');

  const content = (
    <>
      <span className="brand-mark logo-mark" aria-hidden="true">
        <LogoIcon />
      </span>
      {wordmark && (
        <span className="brand-wordmark logo-wordmark">
          <span className="brand-we">we</span>
          <span className="brand-roi">ROI</span>
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} {...rest}>
        {content}
      </button>
    );
  }

  return (
    <div className={classes} {...rest}>
      {content}
    </div>
  );
}
