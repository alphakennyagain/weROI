"use client";

import Link from "next/link";
import { ArrowLeft, Code2, ExternalLink } from "lucide-react";
import ProjectCoverImage from "@/components/ui/ProjectCoverImage";
import type { CaseStudy, Project } from "@/content/types";
import { projectImageFit, cn } from "@/lib/utils";

function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className={className}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-[var(--color-paper)]">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  );
}

const typeLabels: Record<Project["type"], string> = {
  professional: "Contract",
  personal: "Personal",
  coursework: "Coursework",
  security: "Security",
};

interface CaseStudyLayoutProps {
  project: Project;
  caseStudy: CaseStudy;
}

export default function CaseStudyLayout({ project, caseStudy }: CaseStudyLayoutProps) {
  const stack = caseStudy.stack ?? project.stack;

  return (
    <article className="mx-auto max-w-[var(--page-max-width)]">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-ash)] transition hover:text-[var(--color-paper)]"
      >
        <ArrowLeft size={16} aria-hidden />
        Back to projects
      </Link>

      <header className="mx-auto mt-10 max-w-3xl text-center">
        <span className="section-kicker">{typeLabels[project.type]}</span>
        <h1 className="mt-3 text-4xl font-medium tracking-[-0.02em] text-[var(--color-paper)] sm:text-5xl lg:text-[3.25rem]">
          {project.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-pearl)]">
          {caseStudy.overview}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[var(--color-slate)] bg-[var(--color-charcoal)] px-3 py-1 text-xs font-medium text-[var(--color-ash)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary min-h-[44px]"
            >
              <ExternalLink size={15} aria-hidden />
              Live site
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost min-h-[44px]"
            >
              <Code2 size={15} aria-hidden />
              GitHub
            </a>
          )}
        </div>
      </header>

      {caseStudy.screenshots && caseStudy.screenshots.length > 0 && (
        <div
          className={cn(
            "relative mx-auto mt-14 aspect-video max-w-4xl overflow-hidden rounded-[var(--radius-cards)] border border-[var(--color-slate)] shadow-lg",
            projectImageFit[project.slug] === "contain" ? "bg-black" : "bg-[var(--color-graphite)]",
          )}
        >
          <ProjectCoverImage
            src={caseStudy.screenshots[0].src}
            alt={caseStudy.screenshots[0].alt}
            className={
              projectImageFit[project.slug] === "contain"
                ? "object-contain p-8"
                : "object-cover object-top"
            }
            sizes="(max-width: 1024px) 100vw, 896px"
            priority
          />
        </div>
      )}

      {caseStudy.metrics && caseStudy.metrics.length > 0 && (
        <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
          {caseStudy.metrics.map((metric) => (
            <div
              key={metric.label}
              className="surface-card px-5 py-6 text-center"
            >
              <p className="text-2xl font-semibold tracking-tight text-[var(--color-paper)]">
                {metric.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-[var(--color-ash)]">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto mt-16 max-w-3xl space-y-16">
        <section className="text-center">
          <h2 className="text-2xl font-medium tracking-tight text-[var(--color-paper)] sm:text-3xl">
            The problem
          </h2>
          <RichText
            text={caseStudy.problem}
            className="mt-5 text-base leading-[1.75] text-[var(--color-pearl)] sm:text-lg"
          />
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-medium tracking-tight text-[var(--color-paper)] sm:text-3xl">
            The solution
          </h2>
          <RichText
            text={caseStudy.solution}
            className="mt-5 text-base leading-[1.75] text-[var(--color-pearl)] sm:text-lg"
          />
        </section>

        <section>
          <h2 className="text-center text-2xl font-medium tracking-tight text-[var(--color-paper)] sm:text-3xl">
            Architecture
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudy.architecture.map((section) => (
              <div key={section.title} className="surface-card flex flex-col p-6 text-left">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-paper)]">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--color-pearl)]"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-electric-indigo)]"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-center text-2xl font-medium tracking-tight text-[var(--color-paper)] sm:text-3xl">
            Key decisions
          </h2>
          <div className="mt-10 space-y-8">
            {caseStudy.keyDecisions.map((decision) => (
              <div key={decision.title} className="text-center">
                <h3 className="text-lg font-medium text-[var(--color-paper)]">{decision.title}</h3>
                <RichText
                  text={decision.description}
                  className="mx-auto mt-3 max-w-2xl text-base leading-[1.75] text-[var(--color-pearl)]"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--color-slate)] pt-12 text-center">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--color-ash)]">
            Stack
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[var(--color-slate)] bg-[var(--color-graphite)] px-4 py-1.5 text-sm text-[var(--color-pearl)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
