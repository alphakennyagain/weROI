import type { Project } from "../types";
import { getCaseStudyBySlug } from "../case-studies";
import { professionalProjects } from "./professional";
import { personalProjects } from "./personal";
import { courseworkProjects } from "./coursework";

function attachCaseStudies(projects: Project[]): Project[] {
  return projects.map((project) => {
    const caseStudy = getCaseStudyBySlug(project.slug);
    return caseStudy ? { ...project, caseStudy } : project;
  });
}

export const allProjects: Project[] = attachCaseStudies([
  ...professionalProjects,
  ...personalProjects,
  ...courseworkProjects,
]);

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

export function getCaseStudySlugs(): string[] {
  return allProjects
    .filter((p) => p.id !== "portfolio-site" && p.caseStudy)
    .map((p) => p.slug);
}
