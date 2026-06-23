import React from 'react';
import './WorkHeroDoodles.css';

const STROKE = 'currentColor';
const LIME = '#c8f542';
const INK = '#202020';

export default function WorkHeroDoodles({ className = '' }) {
  return (
    <div className={`work-hero-doodles ${className}`.trim()} aria-hidden="true">
      <svg className="work-doodle work-doodle--chart" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 128 C 42 118, 58 92, 78 88 S 118 52, 148 44 S 182 28, 202 18"
          stroke={LIME}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: '4 6' }}
        />
        <circle cx="202" cy="18" r="5" fill={LIME} />
        <path d="M14 134 H206" stroke={INK} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
        <path d="M14 134 V24" stroke={INK} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
        <text x="168" y="12" fill={INK} fontSize="11" fontFamily="var(--font-mono)" opacity="0.45">+340%</text>
      </svg>

      <svg className="work-doodle work-doodle--bars" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="72" width="22" height="36" rx="3" stroke={INK} strokeWidth="2" fill="rgba(200,245,66,0.18)" />
        <rect x="48" y="52" width="22" height="56" rx="3" stroke={INK} strokeWidth="2" fill="rgba(200,245,66,0.32)" />
        <rect x="80" y="34" width="22" height="74" rx="3" stroke={INK} strokeWidth="2" fill={LIME} opacity="0.55" />
        <rect x="112" y="18" width="22" height="90" rx="3" stroke={INK} strokeWidth="2" fill={LIME} />
        <path d="M10 108 H130" stroke={INK} strokeWidth="1.5" strokeLinecap="round" opacity="0.18" />
      </svg>

      <svg className="work-doodle work-doodle--check" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="38" stroke={INK} strokeWidth="2" strokeDasharray="5 7" opacity="0.35" />
        <path
          d="M30 52 L44 66 L72 36"
          stroke={LIME}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <svg className="work-doodle work-doodle--spark" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 8 L44 32 L68 40 L44 48 L40 72 L36 48 L12 40 L36 32 Z" stroke={STROKE} strokeWidth="1.5" fill="rgba(200,245,66,0.2)" />
      </svg>
    </div>
  );
}
