import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import Logo from '../brand/Logo';

export default function GrowthIQNav() {
  return (
    <header className="giq-header site-header">
      <nav className="nav" data-testid="giq-nav">
        <div className="container nav-inner giq-nav-inner">
          <Logo to="/" size="md" data-testid="giq-logo" />
          <div className="giq-nav-links">
            <a href="#my-reports" className="giq-nav-reports">
              <FileText size={14} /> My Reports
            </a>
            <Link to="/" className="giq-back">
              <ArrowLeft size={14} /> Home
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
