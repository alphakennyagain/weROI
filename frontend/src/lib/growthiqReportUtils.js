import { DIGITAL_PRESENCE_FIELDS } from '../data/growthiqConstants';

const VISIBILITY_KEYS = [
  'website', 'seo', 'gbp', 'social_media', 'online_reviews', 'analytics', 'email_marketing', 'crm',
];

const PRESENCE_LABELS = Object.fromEntries(
  DIGITAL_PRESENCE_FIELDS.map((f) => [f.key, f.label]),
);

function primaryGoal(assessment) {
  if (assessment?.primary_goal === 'Other') {
    return assessment?.primary_goal_other || 'Custom growth goal';
  }
  return assessment?.primary_goal || 'Grow the business';
}

export function getReportSnapshot(report, assessment) {
  if (report?.business_snapshot) return report.business_snapshot;
  const presence = assessment?.digital_presence || {};
  const gaps = VISIBILITY_KEYS
    .filter((k) => ['No', 'Not Sure'].includes(presence[k]))
    .map((k) => `${PRESENCE_LABELS[k] || k}: ${presence[k]}`);
  return {
    business_name: assessment?.business_name || 'Your business',
    industry: assessment?.industry || 'Not specified',
    country: assessment?.country || 'Not specified',
    team_size: assessment?.business_size || 'Not specified',
    years_in_business: assessment?.years_in_business || 'Not specified',
    primary_goal: primaryGoal(assessment),
    website_status: presence.website || 'Not Sure',
    website_url: assessment?.website || assessment?.website_url || '',
    visibility_gaps: gaps,
    digital_strengths: VISIBILITY_KEYS
      .filter((k) => presence[k] === 'Yes')
      .map((k) => `${PRESENCE_LABELS[k]}: Yes`),
  };
}

export function getVisibilityProfile(report, assessment, websiteAnalysis) {
  if (report?.visibility_profile) return report.visibility_profile;
  const business = assessment?.business_name || 'your business';
  const score = report?.overall_score || 50;
  return {
    visibility_score: score,
    headline: `This report shows where ${business} may be hard for customers to find online.`,
    primary_goal_context: `Your priority is ${primaryGoal(assessment)}.`,
    invisible_reasons: getReportSnapshot(report, assessment).visibility_gaps.map((g) => ({
      area: g.split(':')[0],
      severity: 'medium',
      detail: g,
    })),
    visible_strengths: (websiteAnalysis?.strengths_detected || []).slice(0, 4),
  };
}

export function getPersonalizedInsights(report, assessment, websiteAnalysis) {
  if (report?.personalized_insights?.length) return report.personalized_insights;
  const insights = [];
  const snap = getReportSnapshot(report, assessment);
  insights.push(
    `${snap.business_name} in ${snap.industry} (${snap.country}) is focused on ${snap.primary_goal.toLowerCase()}.`,
  );
  if (assessment?.business_goals) {
    insights.push(`You shared: "${assessment.business_goals.slice(0, 140)}${assessment.business_goals.length > 140 ? '...' : ''}"`);
  }
  const lowest = [...(report?.categories || [])].sort((a, b) => (a.score || 0) - (b.score || 0)).slice(0, 2);
  lowest.forEach((cat) => {
    if (cat.finding) insights.push(cat.finding);
  });
  (websiteAnalysis?.issues_detected || []).slice(0, 1).forEach((issue) => {
    insights.push(`Live site check: ${issue}`);
  });
  return insights.slice(0, 6);
}

export function getLiveSiteSummary(report, websiteAnalysis) {
  if (report?.live_site_summary) return report.live_site_summary;
  if (!websiteAnalysis?.success) return null;
  return {
    url: websiteAnalysis.final_url || websiteAnalysis.requested_url,
    page_title: websiteAnalysis.title,
    meta_description: websiteAnalysis.meta_description,
    h1_headings: websiteAnalysis.h1_headings || [],
    cta_texts: websiteAnalysis.cta_texts || [],
    nav_link_count: (websiteAnalysis.nav_links || []).length,
    issues: websiteAnalysis.issues_detected || [],
    strengths: websiteAnalysis.strengths_detected || [],
    is_spa_shell: websiteAnalysis.is_spa_shell,
  };
}

export function checklistStorageKey(reportId) {
  return `weroi_growthiq_checks_${reportId}`;
}

export function loadChecklist(reportId) {
  try {
    const raw = localStorage.getItem(checklistStorageKey(reportId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveChecklist(reportId, state) {
  try {
    localStorage.setItem(checklistStorageKey(reportId), JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}
