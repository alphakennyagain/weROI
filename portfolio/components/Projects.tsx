"use client";

import { useMemo, useState } from "react";
import SectionReveal from "./SectionReveal";
import BlurText from "./ui/BlurText";
import ProjectCard from "./ui/project-card";
import { personalProjects } from "@/content/projects/personal";
import { courseworkProjects } from "@/content/projects/coursework";
import { professionalProjects } from "@/content/projects/professional";
import { cn } from "@/lib/utils";
import type { Project, ProjectType } from "@/content/types";

const allProjects: Project[] = [...professionalProjects, ...personalProjects, ...courseworkProjects];

const filters: { key: "all" | ProjectType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "professional", label: "Contract" },
  { key: "personal", label: "Personal" },
  { key: "coursework", label: "Coursework" },
  { key: "security", label: "Security" },
];

export default function Projects() {
  const [active, setActive] = useState<"all" | ProjectType>("all");

  const filtered = useMemo(
    () => (active === "all" ? allProjects : allProjects.filter((p) => p.type === active)),
    [active],
  );

  return (
    <section id="projects" className="border-t border-[var(--color-slate)] bg-[var(--color-charcoal)] px-6 py-24">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <SectionReveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="section-kicker">Work</span>
              <BlurText
                text="Projects"
                className="mt-3 text-4xl font-medium tracking-[-0.02em] text-[var(--color-paper)] sm:text-5xl"
                delay={90}
              />
              <p className="mt-4 max-w-lg text-[var(--color-pearl)]">
                Contract delivery, coursework labs, and personal repositories. Each card links to live demos or GitHub where available.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActive(f.key)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition",
                    active === f.key
                      ? "bg-[var(--color-paper)] text-[var(--color-obsidian)]"
                      : "border border-[var(--color-slate)] text-[var(--color-ash)] hover:border-[var(--color-pearl)] hover:text-[var(--color-pearl)]",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </SectionReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {filtered.map((project, i) => (
            <SectionReveal key={project.id} delay={(i % 4) * 0.06}>
              <ProjectCard project={project} large={project.featured} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
