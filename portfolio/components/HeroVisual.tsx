"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const orbitSkills = [
  { label: "React", angle: 0 },
  { label: "FastAPI", angle: 60 },
  { label: "MongoDB", angle: 120 },
  { label: "TypeScript", angle: 180 },
  { label: "Next.js", angle: 240 },
  { label: "Python", angle: 300 },
];

const codeLines = [
  { prefix: "const", text: " stack = [", color: "text-[var(--color-electric-indigo)]" },
  { prefix: "", text: '  "React", "FastAPI", "MongoDB"', color: "text-[var(--color-pearl)]" },
  { prefix: "", text: "];", color: "text-[var(--color-pearl)]" },
  { prefix: "async function", text: " ship(feature) {", color: "text-[var(--color-electric-indigo)]" },
  { prefix: "", text: "  await test(feature);", color: "text-[var(--color-ash)]" },
  { prefix: "", text: "  return deploy(feature);", color: "text-[var(--color-ash)]" },
  { prefix: "}", text: "", color: "text-[var(--color-pearl)]" },
];

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setOffset({ x: x * 18, y: y * 14 });
    };

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={containerRef} className="relative flex h-[min(520px,70vh)] w-full items-center justify-center">
      <div
        className="absolute inset-0 rounded-[var(--radius-cards)] opacity-80"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at ${50 + offset.x}% ${45 + offset.y}%,
              rgba(21, 0, 255, 0.22), transparent 65%),
            radial-gradient(ellipse 50% 40% at ${30 - offset.x}% ${70 - offset.y}%,
              rgba(94, 232, 122, 0.08), transparent 55%)
          `,
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md"
        animate={{ x: offset.x * 0.5, y: offset.y * 0.5 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <div className="surface-card overflow-hidden border-[var(--color-slate)] bg-[var(--color-charcoal)]/90 p-5 shadow-2xl backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-[10px] uppercase tracking-wider text-[var(--color-stone)]">
              portfolio.tsx
            </span>
          </div>
          <pre className="font-mono text-[11px] leading-relaxed sm:text-xs">
            {codeLines.map((line, i) => (
              <div key={i} className="flex gap-2">
                <span className="w-4 shrink-0 text-right text-[var(--color-stone)]">{i + 1}</span>
                <span>
                  {line.prefix && (
                    <span className="text-[var(--color-electric-indigo)]">{line.prefix} </span>
                  )}
                  <span className={line.color}>{line.text}</span>
                </span>
              </div>
            ))}
          </pre>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ rotate: offset.x * 0.3 }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
      >
        {orbitSkills.map((skill) => {
          const rad = (skill.angle * Math.PI) / 180;
          const radius = 140;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          return (
            <span
              key={skill.label}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-slate)] bg-[var(--color-graphite)]/90 px-3 py-1.5 text-[10px] font-medium text-[var(--color-pearl)] backdrop-blur-sm sm:text-xs"
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              {skill.label}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}
