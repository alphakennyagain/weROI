"use client";

import { useMemo, useState } from "react";
import { Code2, ExternalLink } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { personalProjects } from "@/content/projects/personal";
import { courseworkProjects } from "@/content/projects/coursework";
import { professionalProjects } from "@/content/projects/professional";
import { cn, typeBadgeColors, typeLabels } from "@/lib/utils";
import type { Project, ProjectType } from "@/content/types";

const allProjects: Project[] = [...personalProjects, ...courseworkProjects, ...professionalProjects];

const filters: { key: "all" | ProjectType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "personal", label: "Personal" },
  { key: "coursework", label: "Coursework" },
  { key: "professional", label: "Professional" },
];

export default function ProjectGrid() {
  const [active, setActive] = useState<"all" | ProjectType>("all");

  const filtered = useMemo(
    () => (active === "all" ? allProjects : allProjects.filter((p) => p.type === active)),
    [active],
  );

  return (
    <section id="projects" className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <span className="text-sm font-medium uppercase tracking-widest text-teal-400">Projects</span>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Work across every lane</h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Personal experiments, UTech coursework, and client delivery via weROI — filter by type.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActive(f.key)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm transition",
                  active === f.key
                    ? "bg-teal-500 text-[#0a0e17]"
                    : "border border-white/10 text-zinc-400 hover:border-teal-500/30 hover:text-teal-300",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </SectionReveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <SectionReveal key={project.id} delay={(i % 6) * 0.05}>
              <article className="flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-white">{project.title}</h3>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      typeBadgeColors[project.type],
                    )}
                  >
                    {typeLabels[project.type]}
                  </span>
                </div>
                <p className="mt-2 text-xs text-teal-400/80">{project.problem}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <span key={s} className="rounded bg-white/5 px-2 py-0.5 text-[11px] text-zinc-500">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-3 border-t border-white/5 pt-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-zinc-500 transition hover:text-teal-300"
                    >
                      <Code2 size={13} /> GitHub
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-zinc-500 transition hover:text-teal-300"
                    >
                      <ExternalLink size={13} /> Live
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
