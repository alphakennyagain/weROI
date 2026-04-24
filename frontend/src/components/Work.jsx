import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Work.css";

const INSTAGRAM_URL = "https://instagram.com/weroi.co";

const BUILDS = [
  {
    slug: "dropquick-ja",
    name: "DropQuick JA",
    category: "E-commerce Education",
    description: "Dropship education platform for Jamaican entrepreneurs.",
    url: "https://dropquick-ja.preview.emergentagent.com",
    image: "/work/dropquick.png",
    tags: ["Education", "E-commerce", "Landing"],
    featured: false,
  },
  {
    slug: "resellright",
    name: "ResellRight",
    category: "Reselling Education",
    description: "Step-by-step reselling guide with real proof.",
    url: "https://dropquick-ja.preview.emergentagent.com",
    image: "/work/resellright.png",
    tags: ["Education", "Conversion", "Proof"],
    featured: false,
  },
  {
    slug: "dx-technology",
    name: "D&X Technology",
    category: "Tech Retail",
    description: "Cyberpunk gaming PC store built to sell.",
    url: "https://dx-builds.preview.emergentagent.com",
    image: "/work/dx.png",
    tags: ["E-commerce", "Retail", "3D Motion"],
    featured: true,
  },
  {
    slug: "jmobile-shop",
    name: "JMobile Shop",
    category: "Mobile Retail",
    description: "Clean storefront for a Jamaican phone retailer.",
    url: "https://jmobile-shop.preview.emergentagent.com",
    image: "/work/jmobile.png",
    tags: ["Retail", "Shopify-Style", "Mobile"],
    featured: false,
  },
  {
    slug: "weroi",
    name: "weROI",
    category: "Agency Website",
    description: "Our own site covering lead gen, services and brand.",
    url: "https://weroi.net",
    image: "/work/weroi.png",
    tags: ["Agency", "Lead Gen", "Brand"],
    featured: false,
  },
  {
    slug: "shipping-district",
    name: "The Shipping District",
    category: "Logistics",
    description: "Freight and fleet operations platform.",
    url: "https://freight-fleet-ops.preview.emergentagent.com",
    image: "/work/shipping.png",
    tags: ["Logistics", "Dashboard", "Tracking"],
    featured: false,
  },
  {
    slug: "bookit-ja",
    name: "BookIt JA",
    category: "Bookings",
    description: "Appointment booking for Jamaican service businesses.",
    url: "https://book-it-jamaica.preview.emergentagent.com",
    image: "/work/bookit.png",
    tags: ["Bookings", "Local", "Mobile-First"],
    featured: false,
  },
];

const STATS = [
  { num: "7", label: "Builds" },
  { num: "5+", label: "Industries" },
  { num: "100%", label: "Custom" },
  { num: "JA", label: "Based" },
];

const ArrowUpRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const ArrowLeft = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ProjectCard = ({ build }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <a
      href={build.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`work-card ${build.featured ? "is-featured" : ""}`}
      data-testid={`work-card-${build.slug}`}
      aria-label={`Open ${build.name} in new tab`}
    >
      <div className="work-card-media">
        <img
          src={build.image}
          alt={`${build.name} preview`}
          className={`work-card-img ${loaded ? "is-loaded" : ""}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        <span className="work-card-arrow" aria-hidden="true">
          <ArrowUpRight size={16} />
        </span>
      </div>
      <div className="work-card-body">
        <div className="work-card-category">{build.category}</div>
        <h3 className="work-card-title">{build.name}</h3>
        <p className="work-card-desc">{build.description}</p>
        <div className="work-card-tags">
          {build.tags.map((t) => (
            <span key={t} className="work-pill">{t}</span>
          ))}
        </div>
      </div>
    </a>
  );
};

export default function Work() {
  return (
    <div className="work-root" data-testid="work-page">
      <header className="work-header" data-testid="work-header">
        <div className="work-container work-header-inner">
          <div className="work-brand" data-testid="work-brand">we<span>ROI</span></div>
          <Link to="/" className="work-nav-link" data-testid="work-home-link">
            <ArrowLeft size={14} /> Home
          </Link>
        </div>
      </header>

      <section className="work-hero" data-testid="work-hero">
        <div className="work-container">
          <div className="work-eyebrow">Concepts & Builds</div>
          <h1>What we&rsquo;re capable of<span className="dot">.</span></h1>
          <p className="work-hero-sub">
            A showcase of websites and digital platforms we&rsquo;ve designed and built.
            These are just examples of what we can do &mdash; the possibilities go further than this.
          </p>
        </div>
      </section>

      <section className="work-container" data-testid="work-stats-section">
        <div className="work-stats">
          {STATS.map((s) => (
            <div className="work-stat" key={s.label} data-testid={`work-stat-${s.label.toLowerCase()}`}>
              <div className="work-stat-num">{s.num}<span>.</span></div>
              <div className="work-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="work-container work-projects" data-testid="work-projects">
        <div className="work-projects-header">
          <div className="work-projects-title">Selected Work</div>
          <div className="work-projects-count">{String(BUILDS.length).padStart(2, "0")} / {String(BUILDS.length).padStart(2, "0")}</div>
        </div>
        <div className="work-grid">
          {BUILDS.map((b) => (
            <ProjectCard key={b.slug} build={b} />
          ))}
        </div>

        <div className="work-notes" data-testid="work-notes">
          <p className="work-note">
            <strong>Note:</strong> Previews are hosted on demo servers and may take a few seconds to load.
            If a preview isn&rsquo;t showing, click the card to wake up the server then come back.
          </p>
          <p className="work-note">
            These are concept builds created to demonstrate our capabilities across industries.
            This is just a sample of what we can create for you.
          </p>
        </div>
      </section>

      <section className="work-cta" data-testid="work-cta">
        <div className="work-container work-cta-inner">
          <h2>Ready to be an <span>official client?</span></h2>
          <div className="work-cta-actions">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="work-cta-btn"
              data-testid="work-cta-instagram"
            >
              DM us on Instagram <ArrowRight size={16} />
            </a>
            <div className="work-cta-sub">
              Or visit <a href="https://weroi.net" target="_blank" rel="noopener noreferrer" data-testid="work-cta-weroi-link">weroi.net</a>.
            </div>
          </div>
        </div>
      </section>

      <footer className="work-footer" data-testid="work-footer">
        <div className="work-container work-footer-inner">
          <div className="work-copyright">© 2026 weROI Jamaica</div>
          <div className="work-pulse-dot" data-testid="work-pulse-dot" aria-hidden="true"></div>
        </div>
      </footer>
    </div>
  );
}
