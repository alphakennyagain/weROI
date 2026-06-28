"use client";



import { useState } from "react";

import Link from "next/link";

import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

import ProjectCoverImage from "@/components/ui/ProjectCoverImage";

import { AnimatePresence, motion } from "framer-motion";

import SectionReveal from "./SectionReveal";

import BlurText from "./ui/BlurText";

import { spotlightItems } from "@/content/spotlight";

import { cn } from "@/lib/utils";



export default function Spotlight() {

  const [active, setActive] = useState(0);

  const item = spotlightItems[active];



  const go = (dir: -1 | 1) => {

    setActive((prev) => (prev + dir + spotlightItems.length) % spotlightItems.length);

  };



  return (

    <section id="highlights" className="page-section px-6">

      <div className="mx-auto max-w-[var(--page-max-width)] text-center">

        <SectionReveal>

          <span className="section-kicker">Spotlight</span>

          <BlurText

            text="The highlights"

            className="mt-3 text-4xl font-medium tracking-[-0.02em] text-[var(--color-paper)] sm:text-5xl"

            delay={80}

          />

        </SectionReveal>



        <SectionReveal delay={0.1}>

          <div className="relative mt-12 overflow-hidden rounded-[var(--radius-cards)] border border-[var(--color-slate)] bg-[var(--color-charcoal)] text-left">

            <AnimatePresence mode="wait">

              <motion.div

                key={item.id}

                initial={{ opacity: 0, x: 24 }}

                animate={{ opacity: 1, x: 0 }}

                exit={{ opacity: 0, x: -24 }}

                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}

                className="grid lg:grid-cols-2"

              >

                <div className={cn("relative min-h-[240px] lg:min-h-[360px]", item.id === "spotlight-pntcog" ? "bg-black" : "bg-[var(--color-graphite)]")}>

                  {item.image ? (

                    <ProjectCoverImage
                      src={item.image}
                      alt={item.title}
                      className={cn(
                        item.id === "spotlight-pntcog"
                          ? "object-contain p-6"
                          : "object-cover object-top",
                      )}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={active === 0}
                    />

                  ) : (

                    <div

                      className="absolute inset-0"

                      style={{

                        background: `linear-gradient(135deg, ${item.accent}33, var(--color-graphite))`,

                      }}

                    />

                  )}

                </div>



                <div className="flex flex-col justify-center p-8 lg:p-10">

                  <div className="flex flex-wrap gap-2">

                    {item.stack.map((tag) => (

                      <span

                        key={tag}

                        className="rounded-full border border-[var(--color-slate)] px-3 py-1 text-[11px] text-[var(--color-ash)]"

                      >

                        {tag}

                      </span>

                    ))}

                  </div>

                  <h3 className="mt-5 text-2xl font-medium text-[var(--color-paper)] sm:text-3xl">

                    {item.title}

                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-[var(--color-pearl)] sm:text-base">

                    {item.description}

                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">

                    {item.caseStudyHref && (

                      <Link href={item.caseStudyHref} className="btn-primary text-sm">

                        <ArrowRight size={15} />

                        Case study

                      </Link>

                    )}

                    {item.href && (

                      <a

                        href={item.href}

                        target="_blank"

                        rel="noopener noreferrer"

                        className="btn-ghost text-sm"

                      >

                        <ExternalLink size={15} />

                        {item.linkLabel ?? "Live site"}

                      </a>

                    )}

                    {item.github && (

                      <a

                        href={item.github}

                        target="_blank"

                        rel="noopener noreferrer"

                        className="btn-ghost text-sm"

                      >

                        GitHub

                      </a>

                    )}

                  </div>

                </div>

              </motion.div>

            </AnimatePresence>



            <div className="absolute right-4 top-4 flex gap-2 lg:right-6 lg:top-6">

              <button

                type="button"

                onClick={() => go(-1)}

                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-slate)] bg-[var(--color-obsidian)]/80 text-[var(--color-pearl)] backdrop-blur-sm transition hover:border-[var(--color-paper)]"

                aria-label="Previous highlight"

              >

                <ChevronLeft size={18} />

              </button>

              <button

                type="button"

                onClick={() => go(1)}

                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-slate)] bg-[var(--color-obsidian)]/80 text-[var(--color-pearl)] backdrop-blur-sm transition hover:border-[var(--color-paper)]"

                aria-label="Next highlight"

              >

                <ChevronRight size={18} />

              </button>

            </div>



            <div className="flex justify-center gap-2 border-t border-[var(--color-slate)] px-6 py-4">

              {spotlightItems.map((s, i) => (

                <button

                  key={s.id}

                  type="button"

                  onClick={() => setActive(i)}

                  className={cn(

                    "h-2 rounded-full transition-all",

                    i === active ? "w-6 bg-[var(--color-electric-indigo)]" : "w-2 bg-[var(--color-slate)]",

                  )}

                  aria-label={`Go to ${s.title}`}

                />

              ))}

            </div>

          </div>

        </SectionReveal>



        <div className="mt-6 grid grid-cols-3 gap-3">

          {spotlightItems.map((s, i) => (

            <button

              key={s.id}

              type="button"

              onClick={() => setActive(i)}

              className={cn(

                "flex min-h-[52px] items-center gap-3 rounded-[var(--radius-cards)] border p-3 text-left transition sm:p-4",

                i === active

                  ? "border-[var(--color-electric-indigo)] bg-[var(--color-graphite)]"

                  : "border-[var(--color-slate)] bg-transparent hover:border-[var(--color-pearl)]",

              )}

            >

              <span

                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"

                style={{ backgroundColor: s.accent }}

              >

                {s.tabIcon}

              </span>

              <span className="hidden text-sm font-medium text-[var(--color-paper)] sm:block">{s.title}</span>

            </button>

          ))}

        </div>



        <SectionReveal delay={0.15}>

          <Link href="/projects" className="btn-primary mt-10 inline-flex min-h-[44px] gap-2">

            View all projects

            <ArrowRight size={16} />

          </Link>

        </SectionReveal>

      </div>

    </section>

  );

}


