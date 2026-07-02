import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  Cpu,
  Database,
  Zap,
  TrendingUp,
  Workflow,
  Megaphone,
  Palette,
} from 'lucide-react';
import GlowButton from './GlowButton';

export const SERVICES = [
  {
    id: 'ai-audit',
    title: 'AI Audit & Transformation',
    tagline: 'Find measurable AI value before you deploy.',
    icon: Cpu,
    features: [
      'All-Star AI Growth Audit with revenue baseline',
      'Agent design with governance & monitoring built in',
      'Full transformation roadmap tied to KPIs',
    ],
  },
  {
    id: 'growth-systems',
    title: 'Growth Systems',
    tagline: 'Websites, apps, CRM, and automation infrastructure that scales.',
    icon: Database,
    features: [
      'Website builds & conversion-focused redesigns',
      'Mobile and web apps for customers, teams, and daily operations',
      'SEO and Google search so customers find you online',
      'CRM & operational system integration',
    ],
  },
  {
    id: 'scale-partnerships',
    title: 'Scale Partnerships',
    tagline: 'One partner. Total accountability. Ongoing optimization.',
    icon: Zap,
    features: [
      'Revenue-focused embedded growth partnership',
      'Monthly A/B tests, prompt engineering & reporting',
      'Routine dashboards with clear ROI tracking',
    ],
  },
  {
    id: 'performance',
    title: 'Performance & Conversion',
    tagline: 'Turn traffic into revenue with systems, not guesswork.',
    icon: TrendingUp,
    features: [
      'Funnel audits & conversion rate optimization',
      'Landing page & checkout flow engineering',
      'A/B testing frameworks with measurable lift',
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations & Automation',
    tagline: 'Connect your stack. Eliminate manual work.',
    icon: Workflow,
    features: [
      'API integrations across CRM, payments & ops tools',
      'Workflow automation & AI agent orchestration',
      'Data pipelines with monitoring & error handling',
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing & Paid Media',
    tagline: 'Paid and organic channels engineered for ROI.',
    icon: Megaphone,
    features: [
      'Paid ads strategy with attribution & tracking',
      'Local SEO & content systems that compound',
      'Campaign reporting tied to revenue, not vanity metrics',
    ],
  },
  {
    id: 'branding',
    title: 'Branding & Identity',
    tagline: 'Visual systems that signal trust and convert.',
    icon: Palette,
    features: [
      'Brand identity & design system development',
      'Marketing collateral & social asset production',
      'Consistent visual language across all touchpoints',
    ],
  },
];

const panelVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: { duration: 0.2 },
  },
};

const featureVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3 },
  }),
};

export default function ServicesTabs() {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const navigate = useNavigate();
  const active = SERVICES.find((s) => s.id === activeId) || SERVICES[0];
  const ActiveIcon = active.icon;

  return (
    <div className="services-tabs" data-testid="services-tabs">
      <div className="services-tabs__sidebar" role="tablist" aria-label="Service pillars">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          const isActive = service.id === activeId;
          return (
            <button
              key={service.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`service-panel-${service.id}`}
              id={`service-tab-${service.id}`}
              className={`services-tabs__tab${isActive ? ' is-active' : ''}`}
              onClick={() => setActiveId(service.id)}
              data-testid={`service-tab-${service.id}`}
            >
              <span className="services-tabs__tab-icon" aria-hidden="true">
                <Icon size={18} />
              </span>
              <span className="services-tabs__tab-text">
                <span className="services-tabs__tab-title">{service.title}</span>
                <span className="services-tabs__tab-tagline">{service.tagline}</span>
              </span>
              <ChevronRight
                size={16}
                className="services-tabs__tab-arrow"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <div className="services-tabs__panel-wrap">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            id={`service-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`service-tab-${active.id}`}
            className="services-tabs__panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="services-tabs__panel-icon" aria-hidden="true">
              <ActiveIcon size={28} />
            </div>
            <h3 className="services-tabs__panel-title">{active.title}</h3>
            <p className="services-tabs__panel-tagline">{active.tagline}</p>

            <ul className="services-tabs__features">
              {active.features.map((feature, i) => (
                <motion.li
                  key={feature}
                  custom={i}
                  variants={featureVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {feature}
                </motion.li>
              ))}
            </ul>

            <div className="services-tabs__ctas">
              <GlowButton onClick={() => navigate('/growth-preview')} size="sm">
                Get a Quote <ArrowRight size={14} />
              </GlowButton>
              <GlowButton onClick={() => navigate('/book-call')} size="sm" variant="ghost">
                Book a Call <ArrowRight size={14} />
              </GlowButton>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
