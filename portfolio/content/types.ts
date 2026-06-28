export type ProjectType = "personal" | "coursework" | "professional" | "security";

export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  problem: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  featured?: boolean;
}

export interface SpotlightItem {
  id: string;
  pillar: string;
  title: string;
  description: string;
  stack: string[];
  href?: string;
  github?: string;
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
    location: string;
  };
}
