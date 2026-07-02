import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Mail, Instagram, Calendar, Code2, Terminal, Braces } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SiteHeader, { SITE_NAV_LINKS } from './SiteHeader';
import Logo from './brand/Logo';
import { CASE_STUDIES_SECTION, scrollToSection } from '../utils/scrollToSection';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import InfiniteSlider from './ui/InfiniteSlider';
import CaseStudyCard from './ui/CaseStudyCard';
import GlowButton from './ui/GlowButton';
import ShinyText from './ui/ShinyText';
import ScrollReveal from './ui/ScrollReveal';
import VerticalCutReveal from './ui/VerticalCutReveal';
import TextType from './ui/TextType';
import ServicesTabs from './ui/ServicesTabs';
import ReviewsCarousel from './ui/ReviewsCarousel';
import FaqSection from './ui/FaqSection';
import FitCheckInteractive from './ui/FitCheckInteractive';
import FoundersSection from './FoundersSection';
import { HOME_CASE_STUDIES } from '../data/caseStudies';
import { useCountUp } from '../hooks/useCountUp';

const HOME_STATS = [
  { end: 127, suffix: '+', label: 'Growth systems deployed' },
  { end: 3.2, suffix: '×', label: 'Avg. revenue lift', decimals: 1 },
  { end: 94, suffix: '%', label: 'Client retention' },
  { end: 48, suffix: 'h', label: 'Audit turnaround' },
];

function AnimatedStat({ end, suffix, label, decimals = 0 }) {
  const { ref, display } = useCountUp(end, { decimals });
  return (
    <div className="stat" ref={ref}>
      <div className="stat-num">
        {display}
        <span className="unit">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

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

const processSteps = [
  { key: 'ALIGN',     title: 'Align & Collect',  desc: 'Meet with stakeholders, gather core artifacts. Revenue data, proposals, CRM exports, org structure.', out: 'Executive audit & baseline workbook' },
  { key: 'DIAGNOSE',  title: 'Diagnose & Map',   desc: 'Deep dives across sales, marketing and delivery. Map the value chain, quantify leaks, surface impact levers.', out: 'Opportunity map & top 10 inefficiencies' },
  { key: 'DESIGN',    title: 'Design the Pilot', desc: 'Turn the highest-value lever into a testable hypothesis. Build pilot plan, security checklist, measurement design.', out: 'Pilot implementation plan & ROI workbook' },
  { key: 'DELIVER',   title: 'Deliver & Scale',  desc: 'Execute the pilot, validate results, then scale through implementation or ongoing growth partnership.', out: 'Validated system & scale roadmap' },
];

const processStripVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.06 },
  },
};

const processCellVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function ProcessStrip() {
  const stripRef = useRef(null);
  const isInView = useInView(stripRef, { once: true, margin: '-8% 0px' });
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );
  const [activeIndex, setActiveIndex] = useState(null);
  const [tappedIndex, setTappedIndex] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const showStrip = prefersReducedMotion || isMobile || isInView;

  const handleCellTap = (index) => {
    setTappedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <motion.div
      ref={stripRef}
      className="process-strip"
      variants={processStripVariants}
      initial={showStrip ? 'visible' : 'hidden'}
      animate={showStrip ? 'visible' : 'hidden'}
    >
      {processSteps.map((p, i) => {
        const isActive = activeIndex === i || tappedIndex === i;
        return (
          <motion.div
            key={p.key}
            className={`process-cell${isActive ? ' is-active' : ''}`}
            variants={processCellVariants}
            data-testid={`process-${p.key.toLowerCase()}`}
            tabIndex={0}
            role="group"
            aria-label={`Phase ${i + 1}: ${p.key}`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(i)}
            onBlur={() => setActiveIndex(null)}
            onClick={() => handleCellTap(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCellTap(i);
              }
            }}
          >
            <span className="process-phase-bar" aria-hidden="true" />
            <span className="process-key">0{i + 1} · {p.key}</span>
            <h3 className="process-title">{p.title}</h3>
            <p className="process-desc">{p.desc}</p>
            <div className="process-deliv">→ {p.out}</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

const logos = [
  { src: 'https://svgl.app/library/stripe_wordmark.svg', name: 'Stripe', wide: true },
  { src: 'https://svgl.app/library/github_light.svg', name: 'GitHub' },
  { src: 'https://svgl.app/library/vercel_wordmark.svg', name: 'Vercel', wide: true },
  { src: 'https://svgl.app/library/notion.svg', name: 'Notion' },
  { src: 'https://svgl.app/library/linear.svg', name: 'Linear' },
  { src: 'https://cdn.simpleicons.org/hubspot', name: 'HubSpot' },
  { src: 'https://svgl.app/library/shopify-wordmark-light.svg', name: 'Shopify', wide: true },
  { src: 'https://svgl.app/library/supabase_wordmark_light.svg', name: 'Supabase', wide: true },
  { src: 'https://svgl.app/library/openai.svg', name: 'OpenAI', wide: true },
];


export default function Home() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
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

  const goGrowthPreview = () => navigate('/growth-preview');
  const goCaseStudies = () => scrollToSection(CASE_STUDIES_SECTION, { navigate, pathname });
  const goWorkPage = () => navigate('/work');

  return (
    <div data-testid="home-page" className="home-page">
      <SiteHeader
        variant="home"
        logoTestId="home-logo"
        logoOnClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        navTestId="home-nav"
        onCtaClick={goGrowthPreview}
      />

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

        <div className="hero-premium-body">
        <div className="container hero-grid">
          <div className="hero-content">
            <motion.a
              href="/growth-preview"
              onClick={(e) => { e.preventDefault(); goGrowthPreview(); }}
              className="hero-audit-link"
              data-testid="hero-status-link"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ x: 2 }}
            >
              <ShinyText
                text="Get your free assessment"
                speed={3}
                color="#202020"
                shineColor="#c8f542"
                spread={90}
                className="hero-audit-link-text"
              />
              <ArrowRight size={16} className="hero-audit-link-arrow" aria-hidden="true" />
            </motion.a>
            
            <motion.h1 
              className="display hero-display hero-headline-premium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              We engineer revenue.
              <br />
              You own the{' '}
              <ShinyText
                text="systems"
                speed={3}
                color="#0A0A0A"
                shineColor="#ffffff"
                spread={90}
                className="hero-systems-glow"
              />
              .
            </motion.h1>
            
            <motion.p
              className="body hero-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.04}
                containerClassName="hero-cut-reveal"
              >
                Digital growth agency in Jamaica. weROI builds websites, apps, and SEO so customers find you on Google, plus custom software, marketing funnels, CRM, automation, and ad systems for small businesses and scaling brands that want measurable ROI.
              </VerticalCutReveal>
            </motion.p>
            
            <motion.div 
              className="hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <GlowButton onClick={goGrowthPreview} data-testid="hero-cta-btn" size="lg" className="glow-btn">
                See What&apos;s Holding Me Back <ArrowRight size={18} />
              </GlowButton>
              <GlowButton onClick={goCaseStudies} data-testid="hero-view-work-btn" size="lg" variant="ghost">
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

        {/* LOGO SLIDER - anchored in hero viewport */}
        <div className="hero-logo-bar logo-slider-section">
          <div className="container logo-slider-heading">
            <p className="logo-slider-label">Trusted by experts</p>
            <p className="logo-slider-sub">Used by the leaders</p>
          </div>
          <div className="logo-slider-wrapper">
            <InfiniteSlider gap={48} speed={35} speedOnHover={60} className="hero-logo-slider">
              {logos.map((logo) => (
                <div key={logo.name} className="logo-slider-item" title={logo.name}>
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className={`logo-slider-logo${logo.wide ? ' logo-slider-logo--wide' : ''}`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </InfiniteSlider>
          </div>
        </div>
        </div>
      </section>

      <div className="section-divider section-divider--tight" role="separator" aria-hidden="true" />

      {/* STATS STRIP */}
      <section className="stats section-glow section-glow--center" data-testid="home-stats">
        <div className="container">
          <div className="stats-grid">
            {HOME_STATS.map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" role="separator" aria-hidden="true" />

      {/* CASE STUDIES SECTION with 3D Cards */}
      <section className="case-studies-section" id="case-studies" data-anchor="results">
        <div className="container">
          <div className="case-studies-header">
            <ScrollReveal
              as="h2"
              className="heading case-studies-heading"
              enableBlur={false}
              baseRotation={2}
              textClassName="heading"
            >
              Real Outcomes for Real Businesses
            </ScrollReveal>
            <ScrollReveal
              as="p"
              className="body case-studies-intro"
              enableBlur
              baseRotation={1}
              blurStrength={3}
              textClassName="body"
            >
              Every project is measured by the impact it creates, not just the way it looks.
            </ScrollReveal>
          </div>

          <div className="case-studies-grid">
            {HOME_CASE_STUDIES.map((study) => (
              <CaseStudyCard
                key={study.slug}
                category={study.category}
                title={study.title}
                description={study.description}
                imageUrl={study.image}
                href={study.url}
                metrics={study.metrics}
                actionText="View Live Site"
                data-testid={`case-${study.slug}`}
              />
            ))}
          </div>

          <div className="case-studies-cta">
            <GlowButton onClick={goWorkPage} data-testid="view-all-case-studies-btn" size="lg">
              View All Case Studies <ArrowRight size={18} />
            </GlowButton>
          </div>
        </div>
      </section>

      <div className="section-divider section-divider--on-dark" role="separator" aria-hidden="true" />

      {/* ABOUT */}
      <section className="section section-glow" id="section-about">
        <div className="container">
          <div className="section-head">
            <div className="section-head-left">
              <span className="eyebrow">Who we are</span>
              <ScrollReveal as="h2" className="heading" enableBlur={false} textClassName="heading">
                One partner for build and growth.
              </ScrollReveal>
            </div>
            <div className="section-head-right">
              <ScrollReveal as="p" className="body" enableBlur blurStrength={3} textClassName="body">
                We work with Jamaican business owners who want real systems, not pretty decks. Websites, apps, ads, CRM, and AI that tie back to revenue you can track.
              </ScrollReveal>
            </div>
          </div>

          <div className="three-col">
            <div className="card-soft">
              <div className="card-num">01</div>
              <h3 className="heading-sm">No theory.</h3>
              <p className="body-sm">Only systems that pay for themselves. Every website, ad, and workflow ties back to revenue.</p>
            </div>
            <div className="card-soft">
              <div className="card-num">02</div>
              <h3 className="heading-sm">Data over opinions.</h3>
              <p className="body-sm">Decisions tied to dashboards. If we can't measure it, we don't ship it.</p>
            </div>
            <div className="card-soft">
              <div className="card-num">03</div>
              <h3 className="heading-sm">One partner.</h3>
              <p className="body-sm">No more agency juggling. Web, ads, CRM, and AI under one roof with clear accountability.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" role="separator" aria-hidden="true" />

      <FoundersSection />

      <div className="section-divider" role="separator" aria-hidden="true" />

      {/* SERVICES — tabbed */}
      <section className="section bg-paper section-glow section-glow--right" id="services">
        <div className="container">
          <div className="section-head" id="section-services">
            <div className="section-head-left">
              <span className="eyebrow">What we deliver</span>
              <ScrollReveal as="h2" className="heading" enableBlur={false} textClassName="heading">
                Seven systems. One growth partner.
              </ScrollReveal>
            </div>
            <div className="section-head-right">
              <ScrollReveal as="p" className="body" enableBlur blurStrength={3} textClassName="body">
                Pick a service or run them together as a full growth partnership. Every engagement is engineered for measurable ROI.
              </ScrollReveal>
            </div>
          </div>

          <ServicesTabs />
        </div>
      </section>

      <div className="section-divider" role="separator" aria-hidden="true" />

      {/* REVIEWS */}
      <ReviewsCarousel />

      <div className="section-divider section-divider--on-dark" role="separator" aria-hidden="true" />

      {/* PROCESS */}
      <section className="section section-glow" id="process">
        <div className="container">
          <div className="section-head" id="section-process">
            <div className="section-head-left">
              <span className="eyebrow process-eyebrow">
                <TextType
                  text={['How we work', 'Four phases', 'Predictable delivery']}
                  typingSpeed={55}
                  pauseDuration={2000}
                  startOnVisible
                  showCursor={false}
                  loop
                  className="process-text-type"
                />
              </span>
              <ScrollReveal as="h2" className="heading" enableBlur={false} textClassName="heading">
                {'The All-Star\nAI Growth Framework.'}
              </ScrollReveal>
            </div>
            <div className="section-head-right">
              <ScrollReveal as="p" className="body" enableBlur blurStrength={3} textClassName="body">
                Every engagement runs through the same four-phase loop. Predictable. Auditable. Built so the next pilot starts before the last one ends.
              </ScrollReveal>
            </div>
          </div>

          <ProcessStrip />
        </div>
      </section>

      <div className="section-divider" role="separator" aria-hidden="true" />

      {/* COMPARE */}
      <section className="section bg-paper section-glow section-glow--right" id="section-who">
        <div className="container">
          <div className="section-head">
            <div className="section-head-left">
              <span className="eyebrow">Fit Check</span>
              <ScrollReveal as="h2" className="heading" enableBlur={false} textClassName="heading">
                {'Is weROI right\nfor you?'}
              </ScrollReveal>
            </div>
            <div className="section-head-right">
              <ScrollReveal as="p" className="body" enableBlur blurStrength={3} textClassName="body">
                Straight talk. We work with owners who want real growth systems: better websites, smarter follow up, paid media that converts, and AI that saves hours each week. If that is not you, we will point you somewhere that fits.
              </ScrollReveal>
            </div>
          </div>

          <FitCheckInteractive />
        </div>
      </section>

      <div className="section-divider" role="separator" aria-hidden="true" />

      {/* FAQ */}
      <FaqSection />

      <div className="section-divider" role="separator" aria-hidden="true" />

      {/* CTA */}
      <section className="section section-glow section-glow--center">
        <div className="container">
          <div className="cta-block is-dark" data-testid="home-cta">
            <div>
              <span className="eyebrow cta-eyebrow" style={{ color: 'var(--lime)' }}>
                <TextType
                  text={['Next step', 'Start here', 'Get your weROI GrowthIQ™ report']}
                  typingSpeed={60}
                  pauseDuration={1800}
                  startOnVisible
                  showCursor={false}
                  loop
                  textColors={['var(--lime)']}
                  className="cta-text-type"
                />
              </span>
              <ScrollReveal
                as="h2"
                className="heading-lg cta-scroll-heading"
                enableBlur={false}
                textClassName="heading-lg"
              >
                Ready to engineer your growth?
              </ScrollReveal>
            </div>
            <div>
              <GlowButton onClick={goGrowthPreview} data-testid="cta-btn" size="lg" className="glow-btn">
                See What&apos;s Holding Me Back <ArrowRight size={18} />
              </GlowButton>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" data-testid="home-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Logo size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-testid="home-footer-logo" />
              <p className="body-sm footer-brand-desc">
                Growth infrastructure. AI workflows. Conversion systems. Engineered in Kingston, deployed everywhere.
              </p>
            </div>
            <div>
              <div className="footer-col-title">Explore</div>
              <ul className="footer-list">
                {SITE_NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.section}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.section, { navigate, pathname });
                      }}
                    >
                      {link.label} <ArrowUpRight size={12} className="arrow" />
                    </a>
                  </li>
                ))}
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
                <li data-testid="footer-growth-preview">
                  <Link to="/growth-preview">
                    <Calendar size={14} /> Get My GrowthIQ Score
                  </Link>
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

          <p className="footer-disclaimer body-sm">
            Independent Kingston, Jamaica agency at weroi.net. Not affiliated with Weroi Spain or European
            B2B operations under a similar name.
          </p>

          <div className="footer-bottom">
            <span>© 2026 weROI Jamaica. All rights reserved.</span>
            <nav className="footer-legal" aria-label="Legal">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="footer-legal-sep" aria-hidden="true">·</span>
              <Link to="/terms">Terms of Service</Link>
            </nav>
            <span className="mono" style={{ fontSize: 12 }}>Engineered for growth · v1.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
