export const STORAGE_KEY = 'weroi_growthiq_draft';
export const REPORTS_LIBRARY_KEY = 'weroi_growthiq_reports';

export const GROWTHIQ_BRAND = 'weROI GrowthIQ™';

export const STEP_LABELS = ['Contact', 'Business', 'Digital Presence', 'Goals'];

export const HERO_CHECKMARKS = [
  'Free',
  'Takes 3-5 minutes',
  'Instant weROI GrowthIQ™ Report',
  'No obligation',
  'No sales call unless you ask for one',
];

export const HERO_PROOF_STAT = 'weROI GrowthIQ™ clients average a 3.2x revenue lift after implementing their growth plan.';

export const CTA_TIME_NOTE = 'Takes 3-5 minutes';

export const INDUSTRIES = [
  'Accounting & Finance',
  'Agriculture',
  'Automotive',
  'Beauty & Wellness',
  'Construction',
  'Consulting',
  'E-commerce',
  'Education',
  'Entertainment',
  'Food & Beverage',
  'Healthcare',
  'Hospitality & Tourism',
  'Insurance',
  'Legal',
  'Manufacturing',
  'Marketing & Advertising',
  'Non-profit',
  'Professional Services',
  'Real Estate',
  'Retail',
  'Technology',
  'Transportation & Logistics',
  'Other',
];

export const BUSINESS_SIZES = [
  'Solo / Freelancer',
  '2-5 employees',
  '6-20 employees',
  '21-50 employees',
  '51-200 employees',
  '200+ employees',
];

export const YEARS_IN_BUSINESS = [
  'Less than 1 year',
  '1-2 years',
  '3-5 years',
  '6-10 years',
  '10+ years',
];

export const PRIMARY_GOALS = [
  'Get more leads',
  'Increase online visibility',
  'Improve website conversions',
  'Build brand awareness',
  'Launch or redesign website',
  'Automate marketing and sales',
  'Scale revenue',
  'Other',
];

export const CONTACT_METHODS = ['Email', 'Phone', 'WhatsApp'];

export const COUNTRIES = [
  'Jamaica',
  'United States',
  'Canada',
  'United Kingdom',
  'Trinidad and Tobago',
  'Barbados',
  'Other',
];

export const YES_NO_UNSURE = ['Yes', 'No', 'Not Sure'];
export const WEBSITE_OPTIONS = ['Yes', 'No', 'Being Built'];

export const SOCIAL_PLATFORMS = [
  'Instagram',
  'Facebook',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'X (Twitter)',
  'Other',
];

export const ANALYTICS_TOOLS = [
  'Google Analytics',
  'Google Search Console',
  'Meta Pixel',
  'Hotjar',
  'Other',
];

export const AUTOMATION_TOOLS = [
  'Zapier',
  'Make (Integromat)',
  'HubSpot',
  'Mailchimp',
  'ActiveCampaign',
  'Other',
];

export const DIGITAL_PRESENCE_FIELDS = [
  { key: 'website', label: 'Website', options: WEBSITE_OPTIONS, help: 'A live website where customers can learn about your business and contact you.' },
  { key: 'seo', label: 'SEO', options: YES_NO_UNSURE, help: 'Search Engine Optimization helps people find your business on Google and other search engines.' },
  { key: 'brand_guidelines', label: 'Brand Guidelines', options: YES_NO_UNSURE, help: 'Documented rules for your logo, colors, fonts, and tone of voice across all channels.' },
  { key: 'social_media', label: 'Social Media', options: YES_NO_UNSURE, help: 'Active profiles on platforms like Instagram, Facebook, or LinkedIn.' },
  { key: 'gbp', label: 'Google Business Profile', options: YES_NO_UNSURE, help: 'Your free Google listing that appears in Maps and local search results.' },
  { key: 'email_marketing', label: 'Email Marketing', options: YES_NO_UNSURE, help: 'Sending newsletters, promotions, or follow-ups to a subscriber list.' },
  { key: 'crm', label: 'CRM', options: YES_NO_UNSURE, help: 'Customer Relationship Management software to track leads and client interactions.' },
  { key: 'analytics', label: 'Analytics', options: YES_NO_UNSURE, help: 'Tools that track website visitors, traffic sources, and user behavior.' },
  { key: 'paid_ads', label: 'Paid Ads', options: YES_NO_UNSURE, help: 'Running paid campaigns on Google, Meta, or other ad platforms.' },
  { key: 'online_booking', label: 'Online Booking', options: YES_NO_UNSURE, help: 'Letting customers schedule appointments or reservations online.' },
  { key: 'automation', label: 'Automation', options: YES_NO_UNSURE, help: 'Automated workflows for emails, lead routing, reminders, or repetitive tasks.' },
  { key: 'blog', label: 'Blog', options: YES_NO_UNSURE, help: 'Regular articles or content published on your website or channels.' },
  { key: 'live_chat', label: 'Live Chat', options: YES_NO_UNSURE, help: 'Real-time chat widget on your website for instant visitor support.' },
  { key: 'online_reviews', label: 'Online Reviews', options: YES_NO_UNSURE, help: 'Customer reviews on Google, Facebook, Yelp, or industry platforms.' },
  { key: 'accessibility', label: 'Accessibility', options: YES_NO_UNSURE, help: 'Making your website usable for people with disabilities (screen readers, contrast, keyboard nav).' },
  { key: 'ssl', label: 'SSL Certificate', options: YES_NO_UNSURE, help: 'HTTPS security that encrypts data between your site and visitors (the padlock in the browser).' },
  { key: 'performance_optimization', label: 'Performance Optimization', options: YES_NO_UNSURE, help: 'Fast page load times, compressed images, and smooth mobile experience.' },
];

export const PREMIUM_CARDS = [
  { title: 'Overall Growth Score', desc: 'Your single weROI GrowthIQ™ score with letter grade and growth level.' },
  { title: 'Website Experience', desc: 'How well your site converts visitors into customers.' },
  { title: 'SEO Potential', desc: 'Discoverability and search visibility opportunities.' },
  { title: 'Brand & Trust', desc: 'Consistency, credibility, and social proof signals.' },
  { title: 'Lead Generation', desc: 'Capture, follow-up, and conversion systems.' },
  { title: 'Digital Presence', desc: 'Full footprint across web, social, and local listings.' },
  { title: 'Automation Readiness', desc: 'How prepared you are to scale with smart workflows.' },
  { title: 'Growth Roadmap', desc: 'Prioritized 30, 60, and 90 day action plan.' },
];

export const WHAT_IS_GROWTHIQ = {
  title: 'What Is GrowthIQ?',
  body: [
    `${GROWTHIQ_BRAND} is not a chatbot, a generic AI prompt, or a DIY ChatGPT audit. It is a personalized business review built from your answers and, when you share a URL, a live look at your website.`,
    `Behind every score is the weROI team and methodology. We condensed the same lens we use in client work into a focused assessment that applies to your business, not a one-size-fits-all template.`,
    `Free AI audits online rarely connect to your goals, industry, or actual site. ${GROWTHIQ_BRAND} is specific to you, catered by weROI, so you get a read you can act on.`,
    `This is an experienced team's perspective in minutes, not a script.`,
  ],
  bullets: [
    { icon: 'target', text: 'Personalized from your answers and website signals' },
    { icon: 'shield', text: 'Built on weROI methodology, not random AI integration' },
    { icon: 'sparkles', text: 'Specific findings for your business, not generic SEO tips' },
  ],
};

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Answer a few questions',
    desc: 'Tell us about your business, goals, and current digital setup in a guided assessment.',
  },
  {
    step: '02',
    title: 'Receive your weROI GrowthIQ™ Score instantly',
    desc: 'Our AI analyzes your answers (and your website if provided) to calculate your personalized weROI GrowthIQ™ score.',
  },
  {
    step: '03',
    title: 'Discover your biggest opportunities',
    desc: 'Get category breakdowns, quick wins, and a prioritized roadmap tailored to your business.',
  },
  {
    step: '04',
    title: 'Decide on a complimentary expert review',
    desc: 'Optionally request a free expert review from weROI. No obligation if you just want your report.',
  },
];

export const PROCESSING_STEPS = [
  'Analyzing Website',
  'Reviewing Brand Presence',
  'Evaluating Digital Footprint',
  'Checking Growth Opportunities',
  'Calculating Growth Score',
  'Preparing Recommendations',
];

export const GOAL_QUESTIONS = [
  { key: 'goal_customers', type: 'text', label: 'Who are your ideal customers?', placeholder: 'Describe who you sell to and what they need...' },
  { key: 'goal_differentiator', type: 'text', label: 'What makes you different from competitors?', placeholder: 'Your unique value, specialty, or approach...' },
  { key: 'goal_challenges', type: 'text', label: 'What are your biggest growth challenges right now?', placeholder: 'What is holding you back or causing friction...' },
  { key: 'goal_twelve_month', type: 'text', label: 'What do you want to achieve in the next 12 months?', placeholder: 'Revenue goals, new markets, launches, hires...' },
  {
    key: 'goal_one_improvement',
    type: 'select',
    label: 'If you could improve one thing about your digital presence, what would it be?',
    options: [
      'Website design and conversions',
      'Search visibility (SEO)',
      'Social media presence',
      'Lead generation and follow-up',
      'Brand consistency and trust',
      'Marketing and paid ads',
      'Automation and CRM',
      'Speed and mobile experience',
      'Not sure yet',
      'Other',
    ],
  },
];

export const SOCIAL_PROFILE_BASE = {
  Instagram: 'https://www.instagram.com/',
  Facebook: 'https://www.facebook.com/',
  LinkedIn: 'https://www.linkedin.com/in/',
  TikTok: 'https://www.tiktok.com/@',
  'X (Twitter)': 'https://x.com/',
  YouTube: 'https://www.youtube.com/@',
};

export const SOCIAL_USERNAME_PLACEHOLDERS = {
  Instagram: 'yourbusiness',
  Facebook: 'yourbusiness',
  LinkedIn: 'your-name',
  TikTok: 'yourbusiness',
  'X (Twitter)': 'yourbusiness',
  YouTube: 'yourchannel',
};

export function formatSocialProfile(platform, raw) {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@+/, '').replace(/\s/g, '');
  const base = SOCIAL_PROFILE_BASE[platform];
  if (!base) return trimmed;
  return `${base}${handle}`;
}

export function formatGbpUrl(raw) {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

export function formatWebsiteUrl(raw) {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

export function buildSocialLinks(data) {
  const handles = data.social_platform_links || {};
  return Object.entries(handles)
    .map(([platform, handle]) => {
      const url = formatSocialProfile(platform, handle);
      return url ? `${platform}: ${url}` : null;
    })
    .filter(Boolean)
    .join('\n');
}

export const STEP_ENCOURAGEMENT = {
  1: [
    'Great start! Just a few details so we can personalize your report.',
    'Almost there for contact info. Your data stays private.',
    'Looking good! One more field and we move on.',
  ],
  2: [
    'Nice! Now tell us about your business.',
    'This helps us tailor recommendations to your industry.',
    'Almost done with business details.',
  ],
  3: [
    'This section helps us understand your digital footprint.',
    'No wrong answers here. Honest answers = better insights.',
    'You are doing great. Each answer sharpens your report.',
    'Halfway through digital presence. Keep going!',
    'Almost finished with digital presence.',
  ],
  4: [
    'Last step! Share your goals so we can prioritize what matters.',
    'Your goals shape the recommendations in your report.',
    'Almost done. Your personalized report is moments away.',
  ],
};

export const INITIAL_FORM_DATA = {
  full_name: '',
  business_name: '',
  business_email: '',
  phone: '',
  country: '',
  country_other: '',
  preferred_contact: 'Email',
  industry: '',
  industry_other: '',
  business_size: '',
  years_in_business: '',
  primary_goal: '',
  primary_goal_other: '',
  website_url: '',
  google_business_profile: '',
  social_platforms: [],
  social_platform_links: {},
  social_other: '',
  analytics_tools: [],
  analytics_other: '',
  automation_tools: [],
  automation_other: '',
  digital_presence: DIGITAL_PRESENCE_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}),
  goal_customers: '',
  goal_differentiator: '',
  goal_challenges: '',
  goal_twelve_month: '',
  goal_one_improvement: '',
  goal_one_improvement_other: '',
  business_goals: '',
};

export function buildBusinessGoals(data) {
  const parts = [
    data.goal_customers && `Ideal customers: ${data.goal_customers}`,
    data.goal_differentiator && `Differentiator: ${data.goal_differentiator}`,
    data.goal_challenges && `Challenges: ${data.goal_challenges}`,
    data.goal_twelve_month && `12-month goals: ${data.goal_twelve_month}`,
    data.goal_one_improvement && `Top improvement: ${data.goal_one_improvement === 'Other' ? data.goal_one_improvement_other : data.goal_one_improvement}`,
  ].filter(Boolean);
  return parts.join('\n\n');
}

export function prepareSubmissionData(data) {
  const industry = data.industry === 'Other' ? data.industry_other : data.industry;
  const country = data.country === 'Other' ? data.country_other : data.country;
  const primary_goal = data.primary_goal === 'Other' ? data.primary_goal_other : data.primary_goal;
  const website = data.digital_presence?.website === 'Yes' ? formatWebsiteUrl(data.website_url) : '';
  const social_links = buildSocialLinks(data);
  const business_goals = buildBusinessGoals(data);
  const google_business_profile = data.digital_presence?.gbp === 'Yes'
    ? formatGbpUrl(data.google_business_profile)
    : undefined;
  const goal_one_improvement = data.goal_one_improvement === 'Other'
    ? data.goal_one_improvement_other
    : data.goal_one_improvement;

  return {
    full_name: data.full_name,
    business_name: data.business_name,
    business_email: data.business_email,
    phone: data.phone,
    country,
    preferred_contact: data.preferred_contact,
    industry,
    business_size: data.business_size,
    years_in_business: data.years_in_business,
    primary_goal,
    website: website || undefined,
    social_links: social_links || undefined,
    google_business_profile,
    digital_presence: data.digital_presence,
    business_goals,
    industry_other: data.industry_other,
    country_other: data.country_other,
    primary_goal_other: data.primary_goal_other,
    website_url: data.website_url,
    social_platforms: data.social_platforms,
    social_platform_links: data.social_platform_links,
    analytics_tools: data.analytics_tools,
    analytics_other: data.analytics_other,
    automation_tools: data.automation_tools,
    automation_other: data.automation_other,
    goal_customers: data.goal_customers,
    goal_differentiator: data.goal_differentiator,
    goal_challenges: data.goal_challenges,
    goal_twelve_month: data.goal_twelve_month,
    goal_one_improvement,
    goal_one_improvement_other: data.goal_one_improvement_other,
  };
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      step: parsed.step || 1,
      subStep: parsed.subStep || 0,
      data: { ...INITIAL_FORM_DATA, ...parsed.data },
    };
  } catch {
    return null;
  }
}

export function saveDraft(step, subStep, data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, subStep, data, savedAt: Date.now() }));
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    const d = parsed.data || {};
    return !!(d.full_name || d.business_name || d.business_email || parsed.step > 1);
  } catch {
    return false;
  }
}

export function getTotalSubSteps() {
  return 1 + 1 + DIGITAL_PRESENCE_FIELDS.length + GOAL_QUESTIONS.length;
}

export function getProgressPercent(step, subStep) {
  const stepWeights = [1, 1, DIGITAL_PRESENCE_FIELDS.length, GOAL_QUESTIONS.length];
  let completed = 0;
  for (let i = 0; i < step - 1; i++) completed += stepWeights[i];
  completed += subStep;
  const total = getTotalSubSteps();
  return Math.min(100, Math.round((completed / total) * 100));
}

export function getEstimatedMinutesRemaining(step, subStep) {
  const pct = getProgressPercent(step, subStep);
  const remaining = Math.max(1, Math.ceil((100 - pct) / 100 * 5));
  return remaining;
}

export function saveReportToLibrary(assessment) {
  if (!assessment?.report_id || !assessment?.business_email) return;
  try {
    const existing = JSON.parse(localStorage.getItem(REPORTS_LIBRARY_KEY) || '[]');
    const entry = {
      report_id: assessment.report_id,
      business_email: assessment.business_email,
      business_name: assessment.business_name,
      overall_score: assessment.report?.overall_score,
      letter_grade: assessment.report?.letter_grade,
      growth_level: assessment.report?.growth_level,
      expert_review_requested: !!assessment.expert_review_requested,
      created_at: assessment.created_at || new Date().toISOString(),
    };
    const next = [entry, ...existing.filter((r) => r.report_id !== entry.report_id)].slice(0, 12);
    localStorage.setItem(REPORTS_LIBRARY_KEY, JSON.stringify(next));
    localStorage.setItem('weroi_growthiq_email', assessment.business_email);
  } catch {
    /* ignore */
  }
}

export function getSavedReports() {
  try {
    return JSON.parse(localStorage.getItem(REPORTS_LIBRARY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getSavedReportEmail() {
  return localStorage.getItem('weroi_growthiq_email') || '';
}
