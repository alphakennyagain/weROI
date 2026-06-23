import React from 'react';
import './WorkDoodles.css';

export default function WorkDoodles({ className = '' }) {
  return (
    <div className={`work-doodles ${className}`.trim()} aria-hidden="true">
      <svg
        className="work-doodles-svg"
        viewBox="0 0 420 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect className="work-doodles-bg" width="420" height="360" rx="20" />

        {/* Growth line chart */}
        <path
          className="work-doodles-stroke work-doodles-growth"
          d="M52 268 C 78 252, 96 240, 118 228 C 142 214, 158 198, 178 186 C 198 174, 214 152, 238 132 C 262 112, 284 88, 312 62"
        />
        <circle className="work-doodles-dot" cx="312" cy="62" r="6" />
        <path
          className="work-doodles-stroke work-doodles-arrow"
          d="M298 76 L312 62 L326 76"
        />

        {/* Bar chart sketch */}
        <rect className="work-doodles-bar" x="72" y="214" width="28" height="54" rx="4" />
        <rect className="work-doodles-bar" x="112" y="192" width="28" height="76" rx="4" />
        <rect className="work-doodles-bar work-doodles-bar--accent" x="152" y="168" width="28" height="100" rx="4" />
        <path
          className="work-doodles-stroke work-doodles-baseline"
          d="M58 268 H 196"
        />

        {/* Checkmarks */}
        <g className="work-doodles-check-group">
          <circle className="work-doodles-check-ring" cx="318" cy="228" r="22" />
          <path
            className="work-doodles-stroke work-doodles-check"
            d="M306 228 L314 236 L330 218"
          />
        </g>
        <g className="work-doodles-check-group work-doodles-check-group--sm">
          <circle className="work-doodles-check-ring" cx="88" cy="108" r="16" />
          <path
            className="work-doodles-stroke work-doodles-check"
            d="M80 108 L86 114 L96 102"
          />
        </g>

        {/* Spark / annotation */}
        <path
          className="work-doodles-stroke work-doodles-spark"
          d="M248 108 L256 88 L264 108 L284 116 L264 124 L256 144 L248 124 L228 116 Z"
        />
        <path
          className="work-doodles-stroke work-doodles-caption"
          d="M204 296 C 228 288, 252 284, 280 280"
        />
      </svg>
    </div>
  );
}
