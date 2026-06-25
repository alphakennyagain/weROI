import React from 'react';
import ScrollReveal from './ui/ScrollReveal';
import './FoundersSection.css';

const FOUNDERS = [
  {
    initials: 'ZH',
    name: 'Zachary Hutton',
    role: 'Designer, developer & systems builder',
    bio: 'Zachary runs the tech behind every weROI project: websites, mobile and web apps, automations, and custom software. From first wireframe to live deployment, he builds the systems your business runs on.',
    tags: ['Websites', 'Apps', 'Automation', 'Custom builds'],
  },
  {
    initials: 'TS',
    name: 'Tyler Seivwright',
    role: 'Marketer, analyst & growth lead',
    bio: 'Tyler handles growth, data, and the money side. Campaigns, funnels, ad spend, and ROI tracking so you always know what is working and where to put your next dollar.',
    tags: ['Growth strategy', 'Paid media', 'Analytics', 'ROI tracking'],
  },
];

const TEAM_STATS = [
  { value: '20+', label: 'Live portfolio builds shipped' },
  { value: 'Kingston', label: 'Based in Jamaica, serving local and regional brands' },
  { value: '2-in-1', label: 'Build and marketing under one roof' },
  { value: 'End-to-end', label: 'Sites, apps, and campaigns in one delivery' },
  { value: '2024', label: 'Founded with a focus on measurable ROI' },
  { value: '48h', label: 'Typical audit turnaround for new clients' },
];

export default function FoundersSection() {
  return (
    <section className="section founders-section section-glow" id="team" data-testid="founders-section">
      <div className="container">
        <div className="section-head">
          <div className="section-head-left">
            <span className="eyebrow">The founders</span>
            <h2 className="heading founders-headline">
              Built by specialists in{' '}
              <span className="founders-highlight">conversion-focused growth</span>
            </h2>
          </div>
          <div className="section-head-right">
            <ScrollReveal as="p" className="body" enableBlur blurStrength={3} textClassName="body">
              weROI is a two-person team in Kingston. One builds the product. One runs the numbers. No handoffs between agencies, no guessing on who owns what.
            </ScrollReveal>
            <p className="founders-disclaimer body-sm">
              Independent agency at weroi.net in Kingston, Jamaica. Not affiliated with Weroi Spain or European
              B2B operations under a similar name.
            </p>
          </div>
        </div>

        <div className="founders-grid">
          {FOUNDERS.map((founder) => (
            <article key={founder.name} className="founder-card" data-testid={`founder-${founder.initials.toLowerCase()}`}>
              <div className="founder-card-top">
                <div className="founder-avatar" aria-hidden="true">
                  {founder.initials}
                </div>
                <div className="founder-meta">
                  <h3 className="founder-name">{founder.name}</h3>
                  <p className="founder-role">{founder.role}</p>
                </div>
              </div>
              <p className="founder-bio">{founder.bio}</p>
              <ul className="founder-tags" aria-label={`${founder.name} focus areas`}>
                {founder.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="founders-stats" data-testid="founders-stats">
          {TEAM_STATS.map((stat) => (
            <div key={stat.label} className="founders-stat">
              <div className="founders-stat-value">{stat.value}</div>
              <div className="founders-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
