"use client";

import { useMemo, useState } from "react";
import { Code2, ExternalLink } from "lucide-react";
import SectionReveal from "./SectionReveal";
import BlurText from "./ui/BlurText";
import { personalProjects } from "@/content/projects/personal";
import { courseworkProjects } from "@/content/projects/coursework";
import { professionalProjects } from "@/content/projects/professional";
import { bentoSpans, cn, typeBadgeColors, typeLabels } from "@/lib/utils";
import type { Project, ProjectType } from "@/content/types";

const allProjects: Project[] = [...professionalProjects, ...personalProjects, ...courseworkProjects];

const filters: { key: "all" | ProjectType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "professional", label: "Contract" },
  { key: "personal", label: "Personal" },
  { key: "coursework", label: "Coursework" },
  { key: "security", label: "Security" },
];

function getBentoSize(project: Project, index: number): string {
  if (project.featured) return bentoSpans.large;
  if (index % 7 === 3) return bentoSpans.wide;
  if (index % 5 === 2) return bentoSpans.tall;
  return bentoSpans.default;
}

export default function BentoProjects() {
  const [active, setActive] = useState<"all" | ProjectType>("all");

  const filtered = useMemo(
    () => (active === "all" ? allProjects : allProjects.filter((p) => p.type === active)),
    [active],
  );

  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <SectionReveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="section-kicker">Selected work</span>
              <BlurText
                text="Projects"
                className="mt-3 text-4xl font-medium tracking-[-0.02em] text-[var(--color-paper)] sm:text-5xl"
                delay={90}
              />
              <p className="mt-4 max-w-lg text-[var(--color-pearl)]">
                Contract delivery, coursework labs, and personal experiments — technical depth over volume.
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

        <div className="mt-14 grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-3">
          {filtered.map((project, i) => (
            <SectionReveal
              key={project.id}
              delay={(i % 6) * 0.06}
              className={cn("bento-card", getBentoSize(project, i))}
            >
              <article className="surface-card flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className={cn(
                      "font-medium text-[var(--color-paper)]",
                      project.featured ? "text-2xl" : "text-lg",
                    )}
                  >
                    {project.title}
                  </h3>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-0.5 text-[9px] uppercase tracking-widest",
                      typeBadgeColors[project.type],
                    )}
                  >
                    {typeLabels[project.type]}
                  </span>
                </div>

                <p className="mt-3 text-xs text-[var(--color-ash)]">{project.problem}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-pearl)]">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-[var(--color-obsidian)] px-2.5 py-0.5 text-[10px] text-[var(--color-ash)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex gap-4 border-t border-[var(--color-slate)] pt-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[var(--color-ash)] transition hover:text-[var(--color-paper)]"
                    >
                      <Code2 size={13} /> source
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[var(--color-ash)] transition hover:text-[var(--color-paper)]"
                    >
                      <ExternalLink size={13} /> live
                    </a>
                  )}
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
