import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../brand/Logo';

export default function GrowthIQNav() {
  return (
    <header className="giq-header site-header">
      <nav className="nav" data-testid="giq-nav">
        <div className="container nav-inner giq-nav-inner">
          <Logo to="/" size="md" data-testid="giq-logo" />
          <Link to="/" className="giq-back">
            <ArrowLeft size={14} /> Home
          </Link>
        </div>
      </nav>
    </header>
  );
}
