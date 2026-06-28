"use client";

import { useMemo, useState } from "react";
import SectionReveal from "./SectionReveal";
import ProjectCard from "./ui/project-card";
import { allProjects } from "@/content/projects";
import { cn } from "@/lib/utils";
import type { ProjectType } from "@/content/types";

const filters: { key: "all" | ProjectType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "professional", label: "Contract" },
  { key: "personal", label: "Personal" },
  { key: "coursework", label: "Coursework" },
  { key: "security", label: "Security" },
];

interface ProjectsGridProps {
  className?: string;
  linkToCaseStudy?: boolean;
}

export default function ProjectsGrid({ className, linkToCaseStudy = false }: ProjectsGridProps) {
  const [active, setActive] = useState<"all" | ProjectType>("all");

  const filtered = useMemo(
    () => (active === "all" ? allProjects : allProjects.filter((p) => p.type === active)),
    [active],
  );

  return (
    <div className={cn("mx-auto max-w-[var(--page-max-width)]", className)}>
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActive(f.key)}
            className={cn(
              "rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition",
              active === f.key
                ? "bg-[var(--color-paper)] text-[var(--color-obsidian)]"
                : "border border-[var(--color-slate)] text-[var(--color-ash)] hover:border-[var(--color-pearl)] hover:text-[var(--color-pearl)]",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {filtered.map((project, i) => (
          <SectionReveal key={project.id} delay={(i % 4) * 0.06}>
            <ProjectCard project={project} large={project.featured} linkToCaseStudy={linkToCaseStudy} />
          </SectionReveal>
        ))}
      </div>
    </div>
  );
}
