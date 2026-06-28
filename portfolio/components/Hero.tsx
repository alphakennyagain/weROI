"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, FileText } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { profile } from "@/content/profile";

export default function Hero() {
  return (
    <section className="mesh-hero relative min-h-screen overflow-hidden px-6 pt-28 pb-16">
      <div className="pointer-events-none absolute -right-20 top-32 h-[500px] w-[500px] rounded-full bg-[#e07050]/8 blur-[100px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#e8a849]/6 blur-[80px]" />

      <div className="relative mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* Left — oversized typography */}
        <div className="select-none">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-kicker mb-6">Kingston, Jamaica · UTech CS</p>
            <h1 className="font-display text-[clamp(3.5rem,12vw,9rem)] font-extrabold leading-[0.88] tracking-tighter text-[#f2ebe0]">
              ZACHARY
            </h1>
            <h1 className="font-display text-[clamp(3.5rem,12vw,9rem)] font-extrabold leading-[0.88] tracking-tighter">
              <span className="bg-gradient-to-r from-[#e8a849] via-[#f5c06a] to-[#e07050] bg-clip-text text-transparent">
                HUTTON
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 hidden max-w-sm border-l-2 border-[#e8a849]/40 pl-5 lg:block"
          >
            <p className="font-mono text-xs leading-relaxed text-[#9aab9a]">
              // cs student · full-stack · security-minded
              <br />
              // building across the stack
            </p>
          </motion.div>
        </div>

        {/* Right — narrative + CTAs */}
        <div className="lg:pb-8">
          <SectionReveal delay={0.15}>
            <ul className="mb-8 flex flex-col gap-2">
              {profile.tags.map((tag, i) => (
                <li
                  key={tag}
                  className="font-mono text-sm text-[#9aab9a] transition-colors hover:text-[#e8a849]"
                  style={{ paddingLeft: `${i * 12}px` }}
                >
                  <span className="text-[#e07050]">0{i + 1}</span> — {tag}
                </li>
              ))}
            </ul>
          </SectionReveal>

          <SectionReveal delay={0.25}>
            <p className="max-w-md text-lg leading-relaxed text-[#c8bfb0]">{profile.oneLiner}</p>
          </SectionReveal>

          <SectionReveal delay={0.35}>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 bg-[#e8a849] px-6 py-3 text-sm font-semibold text-[#0a100c] transition hover:bg-[#f5c06a]"
              >
                View work
                <ArrowDownRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                />
              </a>
              <a
                href="#resources"
                className="border border-[#2a4034] px-6 py-3 text-sm text-[#f2ebe0] transition hover:border-[#e8a849]/50 hover:text-[#e8a849]"
              >
                Resources
              </a>
              <a
                href="/resume.pdf"
                className="inline-flex items-center gap-2 border border-[#2a4034] px-6 py-3 text-sm text-[#f2ebe0] transition hover:border-[#e8a849]/50 hover:text-[#e8a849]"
              >
                <FileText size={15} /> Resume
              </a>
              <a
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-[#9aab9a] underline-offset-4 transition hover:text-[#e8a849] hover:underline"
              >
                github/alphakennyagain
              </a>
            </div>
          </SectionReveal>
        </div>
      </div>

      <motion.a
        href="#skills"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-[#9aab9a] transition hover:text-[#e8a849]"
        aria-label="Scroll to skills"
      >
        scroll ↓
      </motion.a>
    </section>
  );
}
