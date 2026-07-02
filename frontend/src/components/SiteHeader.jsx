import React, { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './brand/Logo';
import GlowButton from './ui/GlowButton';
import { scrollToSection } from '../utils/scrollToSection';
import './SiteHeader.css';

export const SITE_NAV_LINKS = [
  { id: 'services', label: 'Services', section: '#services' },
  { id: 'process', label: 'Process', section: '#process' },
  { id: 'work', label: 'Work', section: '#case-studies' },
  { id: 'about', label: 'About', section: '#section-about' },
  { id: 'reviews', label: 'Reviews', section: '#reviews' },
  { id: 'faq', label: 'FAQ', section: '#faq' },
];

function resolveLinkHref(link, isHome) {
  if (link.path) return link.path;
  return isHome ? link.section : `/${link.section}`;
}

export default function SiteHeader({
  variant = 'standard',
  logoSize = 'md',
  logoTestId,
  logoTo,
  logoOnClick,
  navTestId = 'site-nav',
  dark = false,
  showCenterLinks = true,
  showDesktopCta = true,
  ctaLabel = 'Free Assessment',
  ctaTestId = 'nav-cta-btn',
  onCtaClick,
  desktopActions = null,
  children = null,
  className = '',
  innerClassName = 'container nav-inner',
  headerTestId,
  hideLogo = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = variant === 'home' || location.pathname === '/';
  const isGrowthPage = location.pathname === '/growth-preview' || location.pathname === '/audit';
  const showCta = showDesktopCta && !isGrowthPage;
  const panelId = useId();
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => setOpen(false), []);

  const goAudit = useCallback(() => {
    closeMenu();
    if (onCtaClick) {
      onCtaClick();
    } else {
      navigate('/growth-preview');
    }
  }, [closeMenu, navigate, onCtaClick]);

  const handleNavClick = useCallback(
    (e, link) => {
      if (!link.section) return;
      e.preventDefault();
      closeMenu();
      scrollToSection(link.section, { navigate, pathname: location.pathname });
    },
    [closeMenu, location.pathname, navigate],
  );

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, closeMenu]);

  const logoProps = {
    size: logoSize,
    ...(logoTo ? { to: logoTo } : {}),
    ...(logoOnClick ? { onClick: logoOnClick } : {}),
    ...(logoTestId ? { 'data-testid': logoTestId } : {}),
  };

  return (
    <header
      className={`site-header${dark ? ' site-header--dark' : ''}${open ? ' site-header--menu-open' : ''} ${className}`.trim()}
      {...(headerTestId ? { 'data-testid': headerTestId } : {})}
    >
      <nav className="nav" data-testid={navTestId}>
        <div className={innerClassName}>
          {!hideLogo && <Logo {...logoProps} />}

          {showCenterLinks && (
            <div className="nav-center nav-center--desktop">
              {SITE_NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={resolveLinkHref(link, isHome)}
                  className="nav-link"
                  onClick={(e) => handleNavClick(e, link)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <div className="nav-actions">
            {desktopActions}
            {showCta && (
              <GlowButton
                onClick={goAudit}
                data-testid={ctaTestId}
                size="default"
                className="nav-cta-desktop"
              >
                {ctaLabel} <ArrowRight size={16} />
              </GlowButton>
            )}
            <button
              type="button"
              className="nav-menu-toggle"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? 'Close menu' : 'Open menu'}
              data-testid="nav-menu-toggle"
            >
              {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
            </button>
          </div>
        </div>

        {children}
      </nav>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.button
                  type="button"
                  className="nav-mobile-backdrop"
                  aria-label="Close menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onClick={closeMenu}
                />
                <motion.div
                  id={panelId}
                  className="nav-mobile-panel is-open"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Site navigation"
                  initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <nav className="nav-mobile-links" aria-label="Mobile navigation">
                    {SITE_NAV_LINKS.map((link, i) => (
                      <motion.a
                        key={link.id}
                        href={resolveLinkHref(link, isHome)}
                        className="nav-mobile-link"
                        onClick={(e) => handleNavClick(e, link)}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.05, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {link.label}
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </motion.a>
                    ))}
                  </nav>

                  {showCta && (
                    <div className="nav-mobile-footer">
                      <GlowButton onClick={goAudit} size="lg" className="nav-mobile-cta-btn" data-testid="nav-mobile-cta-btn">
                        {ctaLabel} <ArrowRight size={18} />
                      </GlowButton>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
