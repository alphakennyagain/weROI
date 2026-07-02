import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, ClipboardList } from 'lucide-react';
import SiteHeader from './SiteHeader';
import Logo from './brand/Logo';
import GlowButton from './ui/GlowButton';
import CaseStudyCard from './ui/CaseStudyCard';
import { CASE_STUDIES } from '../data/caseStudies';
import './WebDesignJamaica.css';

const PAGE_TITLE = 'Web Design Jamaica | Islandwide & International | weROI';
const PAGE_DESCRIPTION =
  'Jamaica web design from weROI. Conversion-focused websites, SEO, apps, and growth systems islandwide. Based in Kingston with hubs in Portmore and St. Catherine. Remote and international clients welcome.';
const CANONICAL = 'https://weroi.net/web-design-jamaica';
const DEFAULT_TITLE = 'weROI | Digital Growth Agency in Jamaica';
const DEFAULT_DESCRIPTION =
  'weROI is a Jamaican digital growth agency. We build websites, SEO, custom software, marketing funnels, CRM, automation, and ad systems so local businesses get found on Google and scale with measurable ROI.';

const LOCAL_SLUGS = ['pntcog', 'bookit-ja', 'jmobile-shop', 'shipping-district', 'dx-technology'];
const LOCAL_CASE_STUDIES = CASE_STUDIES.filter((s) => LOCAL_SLUGS.includes(s.slug));

const SERVICES = [
  'Website design and conversion-focused redesigns',
  'Mobile-friendly builds that load fast on Jamaican networks',
  'SEO and Google visibility for Jamaica-wide and local parish searches',
  'E-commerce, booking, and checkout flows',
  'CRM, automation, and integrations with your existing tools',
];

export default function WebDesignJamaica() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = PAGE_TITLE;

    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute('content') ?? DEFAULT_DESCRIPTION;
    meta?.setAttribute('content', PAGE_DESCRIPTION);

    const canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical?.getAttribute('href') ?? 'https://weroi.net/';
    canonical?.setAttribute('href', CANONICAL);

    window.scrollTo(0, 0);

    return () => {
      document.title = DEFAULT_TITLE;
      meta?.setAttribute('content', prevDescription);
      canonical?.setAttribute('href', prevCanonical);
    };
  }, []);

  return (
    <div className="local-page" data-testid="web-design-jamaica-page">
      <SiteHeader
        logoTo="/"
        showCenterLinks={false}
        showDesktopCta={false}
        desktopActions={
          <Link to="/" className="local-back" data-testid="local-home-link">
            <ArrowLeft size={14} /> Home
          </Link>
        }
      />

      <main>
        <section className="local-hero section section-glow">
          <div className="container">
            <span className="eyebrow">Jamaica · Islandwide</span>
            <h1 className="heading local-hero-title">Web design across Jamaica</h1>
            <p className="body local-hero-lead">
              weROI builds websites, apps, and growth systems for Jamaican businesses everywhere on the
              island, from Montego Bay and Mandeville to Spanish Town, Ocho Rios, and beyond. We are
              based in Kingston with active hubs in Portmore and St. Catherine, not limited to them.
            </p>
            <p className="body local-hero-lead">
              Remote and international clients are welcome. Same delivery standards whether you are down
              the road or across time zones.
            </p>
            <p className="body-sm local-disclaimer">
              Independent agency at weroi.net. Not affiliated with Weroi Spain or European B2B operations
              under a similar name.
            </p>
          </div>
        </section>

        <section className="section section-tight">
          <div className="container local-services">
            <h2 className="heading-sm">What we build for Jamaican businesses</h2>
            <ul className="local-services-list">
              {SERVICES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="section-divider" role="separator" aria-hidden="true" />

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div className="section-head-left">
                <span className="eyebrow">Local work</span>
                <h2 className="heading-sm">Jamaica builds with measurable results</h2>
              </div>
              <div className="section-head-right">
                <p className="body">
                  From Portmore ministry sites to Kingston retail and island-wide logistics, these projects
                  show how we design for real Jamaican customers.
                </p>
              </div>
            </div>
            <div className="case-studies-grid">
              {LOCAL_CASE_STUDIES.map((study) => (
                <CaseStudyCard
                  key={study.slug}
                  category={study.category}
                  title={study.title}
                  description={study.description}
                  imageUrl={study.image}
                  href={study.url}
                  metrics={study.metrics}
                  data-testid={`local-case-${study.slug}`}
                />
              ))}
            </div>
            <p className="body-sm local-work-link">
              <Link to="/work">See all case studies</Link>
            </p>
          </div>
        </section>

        <section className="section local-cta section-glow section-glow--center">
          <div className="container local-cta-inner">
            <h2 className="heading-sm">Ready for a site that brings in leads?</h2>
            <p className="body local-cta-copy">
              Start with a free growth audit or book a 30-minute call. We will review your site, search
              visibility, and next steps, wherever you are in Jamaica or abroad.
            </p>
            <div className="local-cta-actions">
              <GlowButton onClick={() => navigate('/growth-preview')} size="lg" data-testid="local-cta-audit">
                <ClipboardList size={16} /> Get Your Free Audit <ArrowRight size={16} />
              </GlowButton>
              <GlowButton onClick={() => navigate('/book-call')} size="lg" variant="outline" data-testid="local-cta-book">
                <Calendar size={16} /> Book a call <ArrowRight size={16} />
              </GlowButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer local-footer">
        <div className="container">
          <div className="footer-bottom">
            <Logo size="md" to="/" />
            <span>© 2026 weROI Jamaica. All rights reserved.</span>
            <p className="footer-disclaimer body-sm">
              Independent Jamaican agency at weroi.net, based in Kingston. Serving clients islandwide and
              internationally. Not affiliated with Weroi Spain or European B2B operations under a similar
              name.
            </p>
            <nav className="footer-legal" aria-label="Legal">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="footer-legal-sep" aria-hidden="true">·</span>
              <Link to="/terms">Terms of Service</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
