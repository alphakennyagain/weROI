export type ProjectType = "personal" | "coursework" | "professional" | "security";

export interface ArchitectureSection {
  title: string;
  items: string[];
}

export interface KeyDecision {
  title: string;
  description: string;
}

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  overview: string;
  problem: string;
  solution: string;
  architecture: ArchitectureSection[];
  keyDecisions: KeyDecision[];
  metrics?: CaseStudyMetric[];
  stack?: string[];
  screenshots?: { src: string; alt: string; caption?: string }[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  type: ProjectType;
  problem: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  image?: string;
  result?: string;
  caseStudy?: CaseStudy;
  caseStudyHref?: string;
}

export interface SpotlightItem {
  id: string;
  pillar: string;
  title: string;
  description: string;
  stack: string[];
  href?: string;
  caseStudyHref?: string;
  github?: string;
  image?: string;
  linkLabel?: string;
  accent: string;
  tabIcon: string;
}

export interface SkillCategory {
  name: string;
  items: string[];
}

export interface ResourceLink {
  name: string;
  url: string;
  description?: string;
}

export interface ResourceCategory {
  name: string;
  links: ResourceLink[];
}

export interface TimelineEntry {
  id: string;
  title: string;
  org: string;
  period: string;
  bullets: string[];
  type: "work" | "education";
}

export interface Profile {
  name: string;
  headline: string;
  tags: string[];
  oneLiner: string;
  about: string[];
  stats: { label: string; value: string }[];
  contact: {
    email: string;
    github: string;
    linkedin: string;
    instagram: string;
    location: string;
  };
}
