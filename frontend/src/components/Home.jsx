import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, TrendingUp, Mail, Instagram, Code2, Terminal, Braces, Database, Cpu, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ExitIntentPopup from './ExitIntentPopup';
import InfiniteSlider from './ui/InfiniteSlider';
import Card3D from './ui/Card3D';
import GlowButton from './ui/GlowButton';
import ShinyText from './ui/ShinyText';

const BrandMark = () => (
  <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
    <span className="brand-mark"><TrendingUp /></span>
    weROI
  </div>
);

// Logo SVGs for the marquee
const LogoGithub = () => (
  <svg viewBox="0 0 98 96" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
  </svg>
);

const LogoReact = () => (
  <svg viewBox="0 0 100 100" fill="currentColor">
    <circle cx="50" cy="50" r="8"/>
    <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="currentColor" strokeWidth="3"/>
    <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(60 50 50)"/>
    <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(120 50 50)"/>
  </svg>
);

const LogoNode = () => (
  <svg viewBox="0 0 100 100" fill="currentColor">
    <path d="M50 0L6.7 25v50L50 100l43.3-25V25L50 0zm0 8.7L85.6 30v40L50 91.3 14.4 70V30L50 8.7z"/>
    <path d="M50 25L25 40v30l25 15 25-15V40L50 25zm0 8.7L67.3 43v24L50 76.3 32.7 67V43L50 33.7z"/>
  </svg>
);

const LogoFigma = () => (
  <svg viewBox="0 0 38 57" fill="currentColor">
    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
    <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
    <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
  </svg>
);

const LogoVercel = () => (
  <svg viewBox="0 0 116 100" fill="currentColor">
    <path d="M57.5 0L115 100H0L57.5 0z"/>
  </svg>
);

const LogoStripe = () => (
  <svg viewBox="0 0 60 25" fill="currentColor">
    <path d="M5 10.26c0-.75.62-1.05 1.64-1.05 1.47 0 3.33.45 4.8 1.24V6.21c-1.6-.64-3.19-.9-4.8-.9C2.94 5.31 0 7.45 0 11.06c0 5.63 7.75 4.73 7.75 7.15 0 .89-.78 1.18-1.86 1.18-1.61 0-3.67-.66-5.3-1.55v4.33c1.81.79 3.64 1.13 5.3 1.13 3.78 0 6.38-1.87 6.38-5.51-.02-6.08-7.79-4.99-7.79-7.27l-.48-.26z"/>
    <path d="M15.91 3.65l-4.05.87v3.84l4.05-.87V3.65zm0 5.18h-4.05v14.02h4.05V8.83z"/>
    <path d="M22.09 8.18l-.26-1.08h-3.56v15.75h4.05v-10.7c.96-1.25 2.57-1.02 3.08-.84V8.05c-.53-.2-2.47-.56-3.31 1.13v-1z"/>
    <path d="M30.35 4.36l-3.98.85v14.57c0 2.69 2.02 4.67 4.71 4.67 1.49 0 2.58-.27 3.18-.6v-3.27c-.58.23-3.45 1.06-3.45-1.6V11.72h3.45V8.18h-3.45l-.46-3.82z"/>
    <path d="M43.06 5.31c-1.66 0-2.73.78-3.33 1.32l-.22-1.05h-3.57v20.88l4.05-.86v-5.06c.62.45 1.52 1.08 3.01 1.08 3.05 0 5.82-2.45 5.82-7.84.01-4.96-2.81-7.47-5.76-7.47zm-1.01 11.5c-1 0-1.6-.36-2.01-.8v-6.34c.43-.49 1.05-.87 2.01-.87 1.54 0 2.6 1.72 2.6 4 0 2.32-1.04 4.01-2.6 4.01z"/>
    <path d="M59.73 13.42c0-4.52-2.19-7.8-6.38-7.8-4.21 0-6.75 3.28-6.75 7.77 0 5.13 3.01 7.75 7.32 7.75 2.1 0 3.69-.48 4.89-1.15V16.8c-1.2.62-2.58 1-4.33 1-1.71 0-3.23-.6-3.43-2.68h8.64c.02-.23.04-1.15.04-1.7zm-8.72-1.62c0-1.99 1.22-2.82 2.33-2.82 1.08 0 2.23.83 2.23 2.82h-4.56z"/>
  </svg>
);

const LogoAWS = () => (
  <svg viewBox="0 0 80 48" fill="currentColor">
    <path d="M22.7 18.1c0 .9.1 1.6.3 2.1.2.5.4 1 .8 1.5.1.2.2.3.2.4 0 .2-.1.3-.3.5l-1 .7c-.1.1-.3.1-.4.1-.2 0-.3-.1-.5-.2-.2-.2-.4-.5-.6-.8-.2-.3-.3-.7-.5-1.1-1.2 1.4-2.7 2.1-4.5 2.1-1.3 0-2.3-.4-3.1-1.1-.8-.7-1.2-1.7-1.2-3 0-1.3.5-2.4 1.4-3.2 1-.8 2.2-1.2 3.8-1.2.5 0 1.1 0 1.7.1.6.1 1.2.2 1.8.3v-1.1c0-1.2-.3-2-.8-2.5-.5-.5-1.4-.8-2.7-.8-.6 0-1.2.1-1.8.2-.6.2-1.2.4-1.8.6-.3.1-.5.2-.6.2-.1 0-.2.1-.3.1-.3 0-.4-.2-.4-.6v-.8c0-.3 0-.5.1-.6.1-.1.3-.3.6-.4.6-.3 1.3-.6 2.1-.7.8-.2 1.7-.3 2.6-.3 2 0 3.4.5 4.3 1.4.9.9 1.4 2.3 1.4 4.1v5.4z"/>
  </svg>
);

const LogoNextjs = () => (
  <svg viewBox="0 0 180 180" fill="currentColor">
    <mask id="mask0" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
      <circle cx="90" cy="90" r="90" fill="black"/>
    </mask>
    <g mask="url(#mask0)">
      <circle cx="90" cy="90" r="90" fill="currentColor"/>
      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear)"/>
      <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear)"/>
    </g>
    <defs>
      <linearGradient id="paint0_linear" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="white"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="paint1_linear" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
        <stop stopColor="white"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
);

const LogoTailwind = () => (
  <svg viewBox="0 0 54 33" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"/>
  </svg>
);

// Floating code element
const CodeSnippet = ({ children, className = '' }) => (
  <div className={`floating-code ${className}`}>
    <div className="code-header">
      <span className="code-dot red"></span>
      <span className="code-dot yellow"></span>
      <span className="code-dot green"></span>
    </div>
    <pre className="code-content">{children}</pre>
  </div>
);

const pillars = [
  {
    idx: '01',
    title: 'AI Audit & Transformation',
    desc: 'Identify measurable AI value across operations. Deploy safely with governance and monitoring built in.',
    list: [
      'All-Star AI Growth Audit',
      'Technical & data security review',
      'Agent design with AI workflows',
      'Model governance & monitoring',
      'Full AI transformation roadmap',
    ],
    icon: Cpu,
  },
  {
    idx: '02',
    title: 'Growth Systems & Builds',
    desc: 'Practical infrastructure built fast. Websites, CRMs, marketing engines, content production at agency scale.',
    list: [
      'Website build / redesign',
      'Branding & visual identity',
      'CRM & operational systems',
      'Inbound & outbound marketing',
      'Paid ads & local SEO',
    ],
    icon: Database,
  },
  {
    idx: '03',
    title: 'Scale Partnerships',
    desc: 'One partner, total accountability. Ongoing optimization, A/B testing, prompt engineering and reporting.',
    list: [
      'Revenue-focused partnership',
      'Monthly optimization & A/B tests',
      'AI maintenance & prompt eng.',
      'Routine reporting & dashboards',
      'Embedded growth team',
    ],
    icon: Zap,
  },
];

const processSteps = [
  { key: 'ALIGN',     title: 'Align & Collect',  desc: 'Meet with stakeholders, gather core artifacts. Revenue data, proposals, CRM exports, org structure.', out: 'Executive audit & baseline workbook' },
  { key: 'DIAGNOSE',  title: 'Diagnose & Map',   desc: 'Deep dives across sales, marketing and delivery. Map the value chain, quantify leaks, surface impact levers.', out: 'Opportunity map & top 10 inefficiencies' },
  { key: 'DESIGN',    title: 'Design the Pilot', desc: 'Turn the highest-value lever into a testable hypothesis. Build pilot plan, security checklist, measurement design.', out: 'Pilot implementation plan & ROI workbook' },
  { key: 'DELIVER',   title: 'Deliver & Scale',  desc: 'Execute the pilot, validate results, then scale through implementation or ongoing growth partnership.', out: 'Validated system & scale roadmap' },
];

// Case studies data
const caseStudies = [
  {
    slug: 'bookit-ja',
    category: 'Bookings & Delivery',
    title: 'BookIt JA',
    description: 'Appointment booking and delivery platform for Jamaican service businesses with order management and driver dispatch.',
    image: '/work/bookit.png',
    metrics: [
      { value: '3.2x', label: 'Order Volume' },
      { value: '185%', label: 'Revenue' }
    ],
    url: 'https://book-it-jamaica.preview.emergentagent.com'
  },
  {
    slug: 'shipping-district',
    category: 'Logistics & Freight',
    title: 'The Shipping District',
    description: 'Florida to Jamaica courier platform with live package tracking and fleet operations dashboard.',
    image: '/work/shipping.png',
    metrics: [
      { value: '340%', label: 'Signups' },
      { value: '$2.4M', label: 'Value' }
    ],
    url: 'https://freight-fleet-ops.preview.emergentagent.com'
  },
  {
    slug: 'dx-technology',
    category: 'Tech Retail',
    title: 'D&X Technology',
    description: 'Gaming PC store with custom build configurator and motion-heavy brand experience.',
    image: '/work/dx.png',
    metrics: [
      { value: '74%', label: 'Conversion' },
      { value: '520%', label: 'AOV' }
    ],
    url: 'https://dx-builds.preview.emergentagent.com'
  },
  {
    slug: 'jmobile-shop',
    category: 'Mobile Retail',
    title: 'JMobile Shop',
    description: 'Premium iPhone storefront with trade-in flow and verified inventory management.',
    image: '/work/jmobile.png',
    metrics: [
      { value: '210%', label: 'Traffic' },
      { value: '3.8x', label: 'Bookings' }
    ],
    url: 'https://jmobile-shop.preview.emergentagent.com'
  },
  {
    slug: 'dropquick-ja',
    category: 'E-commerce Education',
    title: 'DropQuick JA',
    description: 'High-converting course platform teaching clothing dropshipping with payments and social proof.',
    image: '/work/dropquick.png',
    metrics: [
      { value: '£180K', label: 'Revenue' },
      { value: '290%', label: 'Growth' }
    ],
    url: 'https://dropquick-ja.preview.emergentagent.com'
  },
  {
    slug: 'resellright',
    category: 'Reselling Education',
    title: 'ResellRight',
    description: 'Supplier-access product page with live countdown and animated social proof ticker.',
    image: '/work/resellright.png',
    metrics: [
      { value: '260%', label: 'Leads' },
      { value: '£420K', label: 'Revenue' }
    ],
    url: 'https://resellright.preview.emergentagent.com'
  },
];

const logos = [
  { component: LogoGithub, name: 'GitHub' },
  { component: LogoReact, name: 'React' },
  { component: LogoNextjs, name: 'Next.js' },
  { component: LogoNode, name: 'Node.js' },
  { component: LogoVercel, name: 'Vercel' },
  { component: LogoFigma, name: 'Figma' },
  { component: LogoStripe, name: 'Stripe' },
  { component: LogoTailwind, name: 'Tailwind' },
];

export default function Home() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_BACKEND_URL || '';
  const [sid] = useState(() => {
    const existing = sessionStorage.getItem('sessionId');
    if (existing) return existing;
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', id);
    return id;
  });

  useEffect(() => {
    fetch(`${API_URL}/api/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'page_view', page: '/', referrer: document.referrer || null, session_id: sid }),
    }).catch(() => {});
  }, [API_URL, sid]);

  const goAudit = () => navigate('/audit');
  const goWork = () => navigate('/work');

  return (
    <div data-testid="home-page" className="home-page">
      <ExitIntentPopup />

      {/* NAV - Centered links */}
      <nav className="nav" data-testid="home-nav">
        <div className="container nav-inner">
          <BrandMark />
          <div className="nav-center">
            <a href="#services" className="nav-link">Services</a>
            <a href="#process" className="nav-link">Process</a>
            <a href="#case-studies" className="nav-link">Work</a>
            <a href="#results" className="nav-link">Results</a>
          </div>
          <GlowButton onClick={goAudit} data-testid="nav-cta-btn" size="default">
            Start a Project <ArrowRight size={16} />
          </GlowButton>
        </div>
      </nav>

      {/* HERO - Premium Full screen with gradient */}
      <section className="hero-premium" id="section-hero">
        {/* Floating Code Elements */}
        <div className="hero-floating-elements">
          <CodeSnippet className="float-code-1">
{`const growth = await weROI.analyze({
  business: "yours",
  goal: "scale"
});`}
          </CodeSnippet>
          <CodeSnippet className="float-code-2">
{`// Revenue up 3.2x
return { roi: "proven" };`}
          </CodeSnippet>
          <div className="float-icon float-icon-1"><Terminal size={20} /></div>
          <div className="float-icon float-icon-2"><Braces size={18} /></div>
          <div className="float-icon float-icon-3"><Code2 size={16} /></div>
        </div>

        <div className="container hero-grid">
          <div className="hero-content">
            <motion.a 
              href="/audit" 
              onClick={(e) => { e.preventDefault(); goAudit(); }} 
              className="hero-status-link" 
              data-testid="hero-status-link"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="status-dot"></span>
              Now booking Q2 partnerships
              <ArrowRight size={14} />
            </motion.a>
            
            <motion.h1 
              className="display hero-display hero-headline-premium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              We engineer{' '}
              <ShinyText 
                text="revenue" 
                speed={3} 
                color="#0A0A0A" 
                shineColor="#c8f542"
                spread={90}
              />.<br />
              <span className="accent">You own the system.</span>
            </motion.h1>
            
            <motion.p 
              className="body hero-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              AI-powered growth infrastructure for businesses ready to scale.
              No guesswork. No vanity metrics. Just measurable ROI, built into systems you own.
            </motion.p>
            
            <motion.div 
              className="hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <GlowButton onClick={goAudit} data-testid="hero-cta-btn" size="lg" className="glow-btn">
                Start a Project <ArrowRight size={18} />
              </GlowButton>
              <GlowButton onClick={goWork} data-testid="hero-view-work-btn" size="lg" variant="ghost">
                View our work <ArrowUpRight size={18} />
              </GlowButton>
            </motion.div>
          </div>

          <motion.div 
            className="hero-meta"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="hero-meta-item">
              <span className="hero-meta-key">EST.</span>
              <span className="hero-meta-val">Kingston, JA · 2024</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-key">STACK</span>
              <span className="hero-meta-val">AI workflows · CRM · paid + organic · custom builds</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-key">SCOPE</span>
              <span className="hero-meta-val">Audit → Pilot → Scale. One partner. Total accountability.</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-key">CLIENTS</span>
              <span className="hero-meta-val">Retail · Logistics · Local services · Education</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LOGO SLIDER - Infinite loop */}
      <section className="logo-slider-section">
        <div className="container">
          <p className="logo-slider-label">Built with tools trusted by leading companies</p>
        </div>
        <div className="logo-slider-wrapper">
          <InfiniteSlider gap={56} speed={40} speedOnHover={80}>
            {logos.map((logo, idx) => (
              <div key={idx} className="logo-slider-item" title={logo.name}>
                <logo.component />
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="stats" data-testid="home-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat"><div className="stat-num">127<span className="unit">+</span></div><div className="stat-label">Growth systems deployed</div></div>
            <div className="stat"><div className="stat-num">3.2<span className="unit">×</span></div><div className="stat-label">Avg. revenue lift</div></div>
            <div className="stat"><div className="stat-num">94<span className="unit">%</span></div><div className="stat-label">Client retention</div></div>
            <div className="stat"><div className="stat-num">48<span className="unit">h</span></div><div className="stat-label">Audit turnaround</div></div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES SECTION with 3D Cards */}
      <section className="case-studies-section" id="case-studies">
        <div className="container">
          <div className="case-studies-header">
            <span className="eyebrow">Proven Results</span>
            <h2 className="heading">Real Outcomes for<br /><span className="accent">Real Businesses</span></h2>
            <p className="body">Every project is measured by the impact it creates, not just the way it looks.</p>
          </div>

          <div className="case-studies-grid-3d">
            {caseStudies.map((study) => (
              <Card3D
                key={study.slug}
                title={study.title}
                subtitle={study.category}
                imageUrl={study.image}
                href={study.url}
                actionText="View Live Site"
                metrics={study.metrics}
                data-testid={`case-${study.slug}`}
              />
            ))}
          </div>

          <div className="case-studies-cta">
            <GlowButton onClick={goWork} size="lg">
              View All Case Studies <ArrowRight size={18} />
            </GlowButton>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="section-about">
        <div className="container">
          <div className="section-head">
            <div className="section-head-left">
              <span className="eyebrow">Who we are</span>
              <h2 className="heading">Built for founders<br />who demand ROI.</h2>
            </div>
            <div className="section-head-right">
              <p className="body">
                weROI was engineered from a simple truth: <strong>if your business can't run without you, you don't have a business. You have a job.</strong>
                We build scalable growth systems that work in the background. AI-powered automation, conversion infrastructure, and strategic partnerships that turn attention into revenue, predictably.
              </p>
            </div>
          </div>

          <div className="three-col">
            <div className="card-soft">
              <div className="card-num">01</div>
              <h3 className="heading-sm">No theory.</h3>
              <p className="body-sm">Only systems that pay for themselves. We measure every action against revenue impact.</p>
            </div>
            <div className="card-soft">
              <div className="card-num">02</div>
              <h3 className="heading-sm">Data over opinions.</h3>
              <p className="body-sm">Decisions tied to dashboards. If we can't measure it, we don't ship it.</p>
            </div>
            <div className="card-soft">
              <div className="card-num">03</div>
              <h3 className="heading-sm">One partner.</h3>
              <p className="body-sm">No more agency juggling. End-to-end accountability under a single roof.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section bg-paper" id="services">
        <div className="container">
          <div className="section-head" id="section-services">
            <div className="section-head-left">
              <span className="eyebrow">What we do</span>
              <h2 className="heading">Three pillars of growth.</h2>
            </div>
            <div className="section-head-right">
              <p className="body">Comprehensive systems engineered for scale. Pick a pillar or run all three together as a full growth partnership.</p>
            </div>
          </div>

          <div className="three-col">
            {pillars.map((p) => (
              <article key={p.idx} className="feature" data-testid={`pillar-${p.idx}`}>
                <div className="feature-header">
                  <div className="feature-idx">{p.idx} / 03</div>
                  <div className="feature-icon-wrap">
                    <p.icon size={20} />
                  </div>
                </div>
                <h3 className="feature-title">{p.title}</h3>
                <p className="feature-desc">{p.desc}</p>
                <ul className="feature-list">
                  {p.list.map((s) => <li key={s}>{s}</li>)}
                </ul>
                <GlowButton onClick={goAudit} size="sm" variant="ghost" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                  Talk to us <ArrowRight size={14} />
                </GlowButton>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section" id="process">
        <div className="container">
          <div className="section-head" id="section-process">
            <div className="section-head-left">
              <span className="eyebrow">How we work</span>
              <h2 className="heading">The All-Star<br />AI Growth Framework.</h2>
            </div>
            <div className="section-head-right">
              <p className="body">Every engagement runs through the same four-phase loop. Predictable. Auditable. Built so the next pilot starts before the last one ends.</p>
            </div>
          </div>

          <div className="process-strip">
            {processSteps.map((p, i) => (
              <div key={p.key} className="process-cell" data-testid={`process-${p.key.toLowerCase()}`}>
                <span className="process-key">0{i + 1} · {p.key}</span>
                <h3 className="process-title">{p.title}</h3>
                <p className="process-desc">{p.desc}</p>
                <div className="process-deliv">→ {p.out}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section className="section bg-paper" id="section-who">
        <div className="container">
          <div className="section-head">
            <div className="section-head-left">
              <span className="eyebrow">Fit Check</span>
              <h2 className="heading">Is weROI right<br />for you?</h2>
            </div>
            <div className="section-head-right">
              <p className="body">Straight talk. We're built for operators who treat growth like engineering. If that's not you, we'll happily refer you elsewhere.</p>
            </div>
          </div>

          <div className="compare">
            <div className="compare-side">
              <div className="compare-key">For</div>
              <h3 className="compare-title">We engineer growth for</h3>
              <ul className="compare-list">
                <li>Founders ready to scale beyond manual operations</li>
                <li>Businesses seeking real AI-powered competitive edge</li>
                <li>Teams tired of agencies that can't prove ROI</li>
                <li>Leaders who value systems over shortcuts</li>
                <li>Companies investing in long-term infrastructure</li>
              </ul>
            </div>
            <div className="compare-side is-not">
              <div className="compare-key">Not For</div>
              <h3 className="compare-title">This isn't for</h3>
              <ul className="compare-list">
                <li>Businesses looking for quick fixes or magic bullets</li>
                <li>Those who want cheap templates over custom systems</li>
                <li>Anyone not ready to invest in real growth</li>
                <li>Leaders who chase vanity metrics over revenue</li>
                <li>Companies unwilling to implement and iterate</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-block is-dark" data-testid="home-cta">
            <div>
              <span className="eyebrow" style={{ color: 'var(--lime)' }}>Next step</span>
              <h2 className="heading-lg" style={{ color: 'var(--paper)', marginTop: 16 }}>
                Ready to engineer<br />your growth?
              </h2>
            </div>
            <div>
              <p className="body" style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 24 }}>
                Get a personalized AI Growth Audit. Discover exactly where revenue is leaking and what systems will capture it.
              </p>
              <GlowButton onClick={goAudit} data-testid="cta-btn" size="lg" className="glow-btn">
                Start a Project <ArrowRight size={18} />
              </GlowButton>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" data-testid="home-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <BrandMark />
              <p className="body-sm" style={{ marginTop: 16, maxWidth: '36ch' }}>
                Growth infrastructure. AI workflows. Conversion systems. Engineered in Kingston, deployed everywhere.
              </p>
            </div>
            <div>
              <div className="footer-col-title">Explore</div>
              <ul className="footer-list">
                <li><a href="#services">Services <ArrowUpRight size={12} className="arrow" /></a></li>
                <li><a href="#process">Process <ArrowUpRight size={12} className="arrow" /></a></li>
                <li><a href="#case-studies">Work <ArrowUpRight size={12} className="arrow" /></a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Contact</div>
              <ul className="footer-list">
                <li data-testid="footer-contact-email">
                  <a href="mailto:contact.weroi@gmail.com">
                    <Mail size={14} /> contact.weroi@gmail.com
                  </a>
                </li>
                <li>
                  <a href="mailto:growth@weroi.net">
                    <Mail size={14} /> growth@weroi.net
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Follow</div>
              <ul className="footer-list">
                <li data-testid="footer-instagram">
                  <a href="https://instagram.com/weroi.co" target="_blank" rel="noopener noreferrer">
                    <Instagram size={14} /> @weroi.co <ArrowUpRight size={12} className="arrow" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 weROI Jamaica. All rights reserved.</span>
            <span className="mono" style={{ fontSize: 12 }}>Engineered for growth · v1.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
