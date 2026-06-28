"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import SectionReveal from "./SectionReveal";
import BlurText from "./ui/BlurText";
import TextType from "./ui/TextType";
import { cybersecurity } from "@/content/cybersecurity";

const terminalLines = [
  { prompt: "$", text: "whoami", output: "zachary@utech-cs — security-aware engineer" },
  { prompt: "$", text: "cat focus.txt", output: null },
  ...cybersecurity.learningFocus.map((item) => ({
    prompt: ">",
    text: item,
    output: null as string | null,
  })),
  { prompt: "$", text: "ls tools/", output: cybersecurity.tools.map((t) => t.name).join("  ") },
  { prompt: "$", text: "status", output: "learning · building · hardening" },
];

export default function CyberSection() {
  const [visibleLines, setVisibleLines] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let i = 0;
          const interval = setInterval(() => {
            i++;
            setVisibleLines(i);
            if (i >= terminalLines.length) clearInterval(interval);
          }, 180);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="cybersecurity" ref={sectionRef} className="px-6 py-24">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="grid gap-12 lg:grid-cols-[0.4fr_0.6fr]">
          <SectionReveal>
            <span className="section-kicker">Cybersecurity</span>
            <BlurText
              text="Terminal mindset."
              className="mt-4 text-4xl font-medium tracking-[-0.02em] text-[var(--color-paper)] sm:text-5xl"
              delay={85}
            />
            <p className="mt-6 leading-relaxed text-[var(--color-pearl)]">{cybersecurity.narrative}</p>

            <ul className="mt-8 space-y-3">
              {cybersecurity.projects.map((proj) => (
                <li key={proj.title}>
                  <a
                    href={proj.href}
                    className="group flex items-center gap-2 text-sm text-[var(--color-pearl)] transition hover:text-[var(--terminal-green)]"
                    {...(proj.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <span className="text-[var(--color-ash)]">→</span>
                    {proj.title}
                    <ExternalLink size={12} className="opacity-0 transition group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div className="overflow-hidden rounded-[var(--radius-cards)] border border-[var(--color-slate)] bg-[var(--color-obsidian)]">
              <div className="flex items-center gap-2 border-b border-[var(--color-slate)] bg-[var(--color-charcoal)] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[var(--color-stone)]" />
                <span className="h-3 w-3 rounded-full bg-[var(--color-ash)]" />
                <span className="h-3 w-3 rounded-full bg-[var(--terminal-green)]/60" />
                <span className="ml-3 text-[10px] text-[var(--color-stone)]">zachary@kali-lab ~ security</span>
              </div>

              <div className="min-h-[360px] p-5 font-mono text-sm leading-relaxed">
                {terminalLines.slice(0, visibleLines).map((line, i) => (
                  <div key={i} className="mb-2">
                    <span className="text-[var(--color-ash)]">{line.prompt} </span>
                    <span className="text-[var(--color-paper)]">{line.text}</span>
                    {line.output && (
                      <div className="mt-1 pl-4 text-[var(--terminal-green)]/90">{line.output}</div>
                    )}
                  </div>
                ))}
                {visibleLines < terminalLines.length && <span className="cursor-blink" />}
                {visibleLines >= terminalLines.length && (
                  <div className="mt-4 border-t border-[var(--color-slate)] pt-4">
                    <TextType
                      text="hardening surfaces · validating inputs · learning continuously"
                      loop={false}
                      showCursor
                      className="text-xs text-[var(--color-ash)]"
                    />
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {cybersecurity.tools.map((tool) => (
                        <div key={tool.name} className="text-xs">
                          <span className="text-[var(--terminal-green)]">{tool.name}</span>
                          <span className="text-[var(--color-stone)]"> — {tool.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
