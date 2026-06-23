import React from 'react';

import { Link } from 'react-router-dom';

import { ArrowLeft, ArrowRight, Mail, Instagram } from 'lucide-react';

import SiteHeader from './SiteHeader';

import Logo from './brand/Logo';

import GlowButton from './ui/GlowButton';

import CaseStudyCard from './ui/CaseStudyCard';

import TextType from './ui/TextType';

import WorkHeroDoodles from './WorkHeroDoodles';

import { CASE_STUDIES } from '../data/caseStudies';

import './Work.css';



const INSTAGRAM_URL = 'https://instagram.com/weroi.co';



export default function Work() {

  return (

    <div className="work-root" data-testid="work-page">

      <SiteHeader

        className="work-header"

        innerClassName="work-container work-header-inner"

        logoTo="/"

        logoTestId="work-logo"

        navTestId="work-nav"

        headerTestId="work-header"

        showCenterLinks={false}

        desktopActions={

          <Link to="/" className="work-back" data-testid="work-home-link" aria-label="Back to home">

            <ArrowLeft size={14} /> Home

          </Link>

        }

      />



      <section className="work-hero" data-testid="work-hero">

        <div className="work-container work-hero-layout">

          <div className="work-hero-content">

            <p className="work-hero-kicker">Client work</p>



            <h1 className="work-hero-title">

              Results speak louder than promises.

            </h1>



            <p className="work-hero-lead">

              Every project we ship gets measured by the impact it creates, not just how polished it looks.

            </p>



            <p className="work-hero-confidence">

              From corner shops in Kingston to brands scaling across the island, we take on ambitious builds and stand behind the numbers.

            </p>



            <p className="work-hero-type" aria-live="polite">

              <TextType

                text={['Measured outcomes', 'Live client builds', 'Real ROI']}

                typingSpeed={65}

                pauseDuration={1800}

                startOnVisible

                textColors={['var(--lime-ink)']}

                className="work-hero-type-inner"

              />

            </p>

          </div>



          <WorkHeroDoodles className="work-hero-doodles-wrap" />

        </div>

      </section>



      <div className="section-divider" role="separator" aria-hidden="true" />



      <section className="work-case-studies" data-testid="work-case-studies">

        <div className="work-container">

          <div className="work-case-studies-head">

            <h2 className="work-case-studies-title">Case studies</h2>

            <p className="work-case-studies-intro">

              Eight live builds across business and ministry. Tap any card to see the site and the results behind it.

            </p>

          </div>



          <div className="case-studies-grid work-case-studies-grid">

            {CASE_STUDIES.map((study) => (

              <CaseStudyCard

                key={study.slug}

                category={study.category}

                title={study.title}

                description={study.description}

                imageUrl={study.image}

                href={study.url}

                metrics={study.metrics}

                actionText="View Live Site"

                data-testid={`work-case-${study.slug}`}

              />

            ))}

          </div>

        </div>

      </section>



      <div className="section-divider" role="separator" aria-hidden="true" />



      <section className="work-cta" data-testid="work-cta">

        <div className="work-container work-cta-inner">

          <div>

            <span className="work-mono work-cta-kicker">Ready to build</span>

            <h2 className="work-cta-title">

              Ready to be an{' '}

              <span className="work-cta-accent">official client?</span>

            </h2>

          </div>



          <div className="work-cta-side">

            <GlowButton

              onClick={() => window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer')}

              size="lg"

              className="glow-btn"

              data-testid="work-cta-instagram"

            >

              <Instagram size={16} /> DM us on Instagram <ArrowRight size={16} />

            </GlowButton>



            <div className="work-cta-sub">

              Or visit{' '}

              <a href="https://weroi.net" target="_blank" rel="noopener noreferrer" data-testid="work-cta-weroi-link">

                weroi.net

              </a>

              .

            </div>

          </div>

        </div>

      </section>



      <footer className="work-footer" data-testid="work-footer">

        <div className="work-container work-footer-inner">

          <div className="work-footer-left">

            <Logo to="/" size="md" />

            <span className="work-copyright">© 2026 weROI Jamaica</span>

          </div>



          <div className="work-footer-right">
            <Link to="/privacy" className="work-footer-link">Privacy Policy</Link>
            <Link to="/terms" className="work-footer-link">Terms of Service</Link>
            <a href="mailto:contact.weroi@gmail.com" className="work-footer-link">
              <Mail size={13} /> contact.weroi@gmail.com
            </a>
          </div>

        </div>

      </footer>

    </div>

  );

}


