"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import SectionReveal from "./SectionReveal";
import TextType from "./ui/TextType";
import HeroVisual from "./HeroVisual";
import { useResume } from "@/components/ResumeProvider";
import { profile } from "@/content/profile";

const taglines = [
  "TypeScript · Python · React",
  "building APIs & web apps",
  "open to internships & co-ops",
  "security-aware engineering",
];

const socialLinkClass =
  "inline-flex items-center gap-1 text-sm text-[var(--color-stone)] transition-colors hover:text-[var(--color-paper)]";

export default function Hero() {
  const { openResume } = useResume();

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-x-hidden px-6 pb-16 pt-24">
      <div className="flex flex-1 flex-col justify-center">
        <div className="relative mx-auto grid w-full max-w-[var(--page-max-width)] items-center gap-10 text-center lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col justify-center">
            <SectionReveal>
              <p className="section-kicker mb-5">Full-Stack Developer · Building APIs & web apps</p>
              <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.04em] text-[var(--color-paper)]">
                Zachary
                <br />
                Hutton
              </h1>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <div className="mx-auto mt-5 min-h-[2rem] max-w-md text-lg text-[var(--color-pearl)]">
                <TextType
                  text={taglines}
                  typingSpeed={45}
                  pauseDuration={2200}
                  showCursor
                  cursorCharacter="|"
                  className="font-medium"
                />
              </div>
            </SectionReveal>

            <SectionReveal delay={0.22}>
              <p className="mx-auto mt-5 max-w-md text-base leading-[1.45] text-[var(--color-pearl)] lg:text-lg">
                {profile.oneLiner}
              </p>
            </SectionReveal>

            <SectionReveal delay={0.3}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="#highlights" className="btn-primary min-h-[44px]">
                  View my work
                </a>
                <a href="#contact" className="btn-ghost min-h-[44px]">
                  Get in touch
                </a>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.35}>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <a
                  href={profile.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                >
                  GitHub
                  <ArrowUpRight size={14} aria-hidden />
                </a>
                <a
                  href={profile.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                >
                  LinkedIn
                  <ArrowUpRight size={14} aria-hidden />
                </a>
                <button type="button" onClick={openResume} className={socialLinkClass}>
                  Resume
                  <ArrowDown size={14} aria-hidden />
                </button>
              </div>
            </SectionReveal>
          </div>

          <SectionReveal delay={0.18} className="hidden w-full lg:block">
            <HeroVisual />
          </SectionReveal>
        </div>
      </div>

      <a
        href="#skills"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-[var(--color-stone)] transition hover:text-[var(--color-pearl)]"
        aria-label="Scroll to skills"
      >
        scroll ↓
      </a>
    </section>
  );
}
