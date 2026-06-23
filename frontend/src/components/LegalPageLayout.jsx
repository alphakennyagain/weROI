import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SiteHeader from './SiteHeader';
import './LegalPage.css';

export default function LegalPageLayout({ title, lastUpdated, children, testId }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page" data-testid={testId}>
      <SiteHeader
        logoTo="/"
        showCenterLinks={false}
        showDesktopCta={false}
      />

      <main className="legal-main">
        <div className="container legal-container">
          <Link to="/" className="legal-back">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>

          <h1 className="legal-title">{title}</h1>
          <p className="legal-updated">Last updated: {lastUpdated}</p>

          <article className="legal-content">{children}</article>
        </div>
      </main>

      <footer className="legal-footer">
        <div className="container">
          <div className="footer-bottom">
            <span>© 2026 weROI Jamaica. All rights reserved.</span>
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
