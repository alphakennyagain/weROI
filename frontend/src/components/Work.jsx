import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowLeft, ArrowRight, Mail, Instagram, TrendingUp } from "lucide-react";
import "./Work.css";

const INSTAGRAM_URL = "https://instagram.com/weroi.co";

const BUILDS = [
  {
    slug: "bookit-ja",
    name: "BookIt JA",
    category: "Bookings & Delivery",
    description: "Appointment booking and delivery platform for Jamaican service businesses — order management, driver dispatch and live status built in.",
    url: "https://book-it-jamaica.preview.emergentagent.com",
    image: "/work/bookit.png",
    tags: ["Admin Dashboard", "Live Order Tracking", "Restaurant CMS", "Mobile-First"],
    featured: false,
  },
  {
    slug: "shipping-district",
    name: "The Shipping District",
    category: "Logistics & Freight",
    description: "Florida→Jamaica courier platform with live package tracking, customer accounts and a full back-office fleet operations dashboard.",
    url: "https://freight-fleet-ops.preview.emergentagent.com",
    image: "/work/shipping.png",
    tags: ["Live Package Tracking", "Fleet Ops", "Customer Portal", "Admin Dashboard"],
    featured: false,
  },
  {
    slug: "dx-technology",
    name: "D&X Technology",
    category: "Tech Retail / E-commerce",
    description: "Gaming PC store built to sell. Custom build configurator, product gallery, motion-heavy brand experience and order management backend.",
    url: "https://dx-builds.preview.emergentagent.com",
    image: "/work/dx.png",
    tags: ["E-commerce", "Custom PC Configurator", "Admin Panel", "Order Management", "Motion"],
    featured: true,
  },
  {
    slug: "jmobile-shop",
    name: "JMobile Shop",
    category: "Mobile Retail",
    description: "Premium iPhone storefront with trade-in flow, verified inventory management, customer auth and a clean Apple-grade shopping experience.",
    url: "https://jmobile-shop.preview.emergentagent.com",
    image: "/work/jmobile.png",
    tags: ["Inventory Management", "Trade-In System", "Auth & Accounts", "Product Catalog"],
    featured: false,
  },
  {
    slug: "dropquick-ja",
    name: "DropQuick JA",
    category: "E-commerce Education",
    description: "High-converting course platform teaching clothing dropshipping — payments, embedded video, social proof and a full urgency system.",
    url: "https://dropquick-ja.preview.emergentagent.com",
    image: "/work/dropquick.png",
    tags: ["Course Platform", "Payments", "Urgency System", "Proof & Testimonials"],
    featured: false,
  },
  {
    slug: "resellright",
    name: "ResellRight",
    category: "Reselling Education",
    description: "Supplier-access product page with a live countdown, animated social proof ticker and lifetime purchase flow optimized for conversion.",
    url: "https://dropquick-ja.preview.emergentagent.com",
    image: "/work/resellright.png",
    tags: ["Supplier Access", "Countdown Urgency", "Social Proof Ticker", "Payments"],
    featured: false,
  },
  {
    slug: "weroi",
    name: "weROI",
    category: "Agency Website",
    description: "Our own site. Multi-step AI growth audit, exit-intent guide capture, automated 3-part email sequence and a private admin dashboard.",
    url: "https://weroi.net",
    image: "/work/weroi.png",
    tags: ["Lead Gen Funnel", "Email Automation", "Admin Dashboard", "Analytics"],
    featured: false,
  },
];

const STATS = [
  { num: "7",    label: "Concept builds" },
  { num: "5+",   label: "Industries" },
  { num: "100%", label: "Custom code" },
  { num: "JA",   label: "Engineered in Kingston" },
];

const SERVICES = [
  { num: "01", name: "Web Design & Development", desc: "Custom sites built to convert visitors into customers." },
  { num: "02", name: "SEO",                       desc: "Get found on Google by the right people at the right time." },
  { num: "03", name: "Lead Generation",           desc: "Systems that bring in clients on autopilot." },
  { num: "04", name: "Email Automation",          desc: "Follow-up sequences that sell while you sleep." },
  { num: "05", name: "Social Media Growth",       desc: "Content strategy and account management that builds real audiences." },
  { num: "06", name: "Sales Funnels",             desc: "Full funnel builds from ad click to checkout." },
  { num: "07", name: "Brand Identity",            desc: "Logo, colors, tone and the full package." },
  { num: "08", name: "Digital Strategy",          desc: "A growth roadmap tailored specifically to your business." },
];

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
        <div className="work-card-row">
          <span className="work-card-category">{build.category}</span>
          <span className="work-card-status">
            <span className="work-card-status-dot" />
            LIVE
          </span>
        </div>
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
      {/* HEADER */}
      <header className="work-header" data-testid="work-header">
        <div className="work-container work-header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark"><TrendingUp /></span>
            weROI
          </Link>
          <div className="work-header-meta">
            <span className="work-route mono">/ work</span>
            <Link to="/" className="work-back" data-testid="work-home-link">
              <ArrowLeft size={14} /> Home
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="work-hero" data-testid="work-hero">
        <div className="work-container">
          <span className="pill" style={{ marginBottom: 24 }}>
            <span className="pill-dot"></span>
            <span className="pill-mono">CONCEPTS &amp; BUILDS · 2024 — 2026</span>
          </span>
          <h1 className="work-hero-title">
            What we&rsquo;re<br />
            <span className="accent">capable of.</span>
          </h1>
          <p className="work-hero-sub">
            A showcase of websites and digital platforms we&rsquo;ve designed and built.
            These are examples — the possibilities go further.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="work-container" data-testid="work-stats-section">
        <div className="work-stats">
          {STATS.map((s) => (
            <div className="work-stat" key={s.label} data-testid={`work-stat-${s.label.split(' ')[0].toLowerCase()}`}>
              <div className="work-stat-num">{s.num}</div>
              <div className="work-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="work-container work-projects" data-testid="work-projects">
        <div className="work-projects-head">
          <div>
            <span className="work-mono">Selected Work</span>
            <h2 className="work-projects-title">Concept builds<br /><span className="accent">across industries.</span></h2>
          </div>
          <div className="work-projects-count">{String(BUILDS.length).padStart(2, "0")} / {String(BUILDS.length).padStart(2, "0")}</div>
        </div>

        <div className="work-grid">
          {BUILDS.map((b) => <ProjectCard key={b.slug} build={b} />)}
        </div>

        <div className="work-notes" data-testid="work-notes">
          <p className="work-note">
            <strong>Note —</strong> Previews are hosted on demo servers and may take a few seconds to load. If a preview isn&rsquo;t showing, click the card to wake the server then come back.
          </p>
          <p className="work-note">
            These are concept builds created to demonstrate our capabilities across industries. This is just a sample of what we can create for you.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="work-services" data-testid="work-services">
        <div className="work-container">
          <div className="work-services-head">
            <span className="work-mono">How we grow you</span>
            <h2 className="work-services-title">
              Eight ways<br />
              <span className="accent">we deliver growth.</span>
            </h2>
            <div className="work-services-line" data-testid="work-services-tagline">
              <span className="work-services-line-dot" />
              <span>Web design · SEO · Lead generation · Email automation · Social media · And more.</span>
            </div>
          </div>

          <div className="work-services-grid">
            {SERVICES.map((s) => (
              <div key={s.num} className="work-service" data-testid={`work-service-${s.num}`}>
                <div className="work-service-num">{s.num}</div>
                <div className="work-service-body">
                  <h3 className="work-service-name">{s.name}</h3>
                  <p className="work-service-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="work-cta" data-testid="work-cta">
        <div className="work-container work-cta-inner">
          <div>
            <span className="work-mono" style={{ color: 'rgba(255,255,255,0.55)' }}>Ready to build</span>
            <h2 className="work-cta-title">
              Ready to be<br />an <span className="accent">official client?</span>
            </h2>
          </div>
          <div className="work-cta-side">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="work-cta-btn" data-testid="work-cta-instagram">
              <Instagram size={16} /> DM us on Instagram <ArrowRight size={16} />
            </a>
            <div className="work-cta-sub">
              Or visit <a href="https://weroi.net" target="_blank" rel="noopener noreferrer" data-testid="work-cta-weroi-link">weroi.net</a>.
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="work-footer" data-testid="work-footer">
        <div className="work-container work-footer-inner">
          <div className="work-footer-left">
            <Link to="/" className="brand">
              <span className="brand-mark"><TrendingUp /></span>
              weROI
            </Link>
            <span className="work-copyright">© 2026 weROI Jamaica</span>
          </div>
          <div className="work-footer-right">
            <a href="mailto:contact.weroi@gmail.com" className="work-footer-link">
              <Mail size={13} /> contact.weroi@gmail.com
            </a>
            <span className="work-pulse-dot" data-testid="work-pulse-dot" aria-hidden="true"></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
