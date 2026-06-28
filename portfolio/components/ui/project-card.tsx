import Link from "next/link";

import { ArrowRight, Code2, ExternalLink } from "lucide-react";

import ProjectCoverImage from "@/components/ui/ProjectCoverImage";

import {

  cn,

  getProjectAccent,

  projectImageFit,

  typeBadgeColors,

  typeLabels,

  typeStripeColors,

} from "@/lib/utils";

import type { Project } from "@/content/types";



interface ProjectCardProps {

  project: Project;

  className?: string;

  large?: boolean;

  linkToCaseStudy?: boolean;

}



export default function ProjectCard({

  project,

  className,

  large = false,

  linkToCaseStudy = false,

}: ProjectCardProps) {

  const caseStudyHref = project.caseStudy ? `/projects/${project.slug}` : undefined;

  const accent = getProjectAccent(project.slug);

  const imageFit = projectImageFit[project.slug] ?? "cover";



  return (

    <article

      className={cn(

        "surface-card group relative flex h-full flex-col overflow-hidden",

        "transition duration-300 hover:-translate-y-1",

        className,

      )}

      style={

        {

          "--project-accent": accent,

        } as React.CSSProperties

      }

    >

      <div

        className={cn("absolute inset-x-0 top-0 z-10 h-1", typeStripeColors[project.type])}

        aria-hidden

      />



      {project.image && (

        <div

          className={cn(

            "relative w-full overflow-hidden",

            imageFit === "contain" ? "bg-black" : "bg-[var(--color-graphite)]",

            large ? "h-56" : "h-44",

          )}

        >

          <ProjectCoverImage
            src={project.image}
            alt={`${project.title} cover`}
            className={cn(
              "transition duration-500 group-hover:scale-[1.02]",
              imageFit === "contain" ? "object-contain p-3" : "object-cover object-top",
            )}
            sizes="(max-width: 768px) 100vw, 50vw"
          />

        </div>

      )}



      <div className="flex flex-1 flex-col p-6">

        <div className="flex items-start justify-between gap-3">

          <h3

            className={cn(

              "font-medium text-[var(--color-paper)]",

              large ? "text-2xl" : "text-xl",

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



        {project.result && (

          <p className="mt-2 text-xs font-medium" style={{ color: accent }}>

            {project.result}

          </p>

        )}



        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-pearl)]">

          {project.description}

        </p>



        <div className="mt-5 flex flex-wrap gap-2">

          {project.stack.map((tech) => (

            <span

              key={tech}

              className="rounded-full border border-[var(--color-slate)] bg-[var(--color-obsidian)]/80 px-3 py-1 text-[11px] text-[var(--color-ash)] transition group-hover:border-[color-mix(in_srgb,var(--project-accent)_35%,var(--color-slate))]"

            >

              {tech}

            </span>

          ))}

        </div>



        <div className="mt-6 flex flex-wrap gap-3 border-t border-[var(--color-slate)] pt-4">

          {caseStudyHref && linkToCaseStudy && (

            <Link href={caseStudyHref} className="btn-primary text-xs">

              <ArrowRight size={14} />

              Case study

            </Link>

          )}

          {project.live && (

            <a

              href={project.live}

              target="_blank"

              rel="noopener noreferrer"

              className="btn-primary text-xs"

            >

              <ExternalLink size={14} />

              Live site

            </a>

          )}

          {project.github && (

            <a

              href={project.github}

              target="_blank"

              rel="noopener noreferrer"

              className="btn-ghost text-xs"

            >

              <Code2 size={14} />

              GitHub

            </a>

          )}

        </div>

      </div>



      <div

        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100"

        style={{

          boxShadow: `0 12px 40px -12px color-mix(in srgb, ${accent} 45%, transparent)`,

        }}

        aria-hidden

      />

    </article>

  );

}

