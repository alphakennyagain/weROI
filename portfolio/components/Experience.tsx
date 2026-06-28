import SectionReveal from "./SectionReveal";
import { experience } from "@/content/experience";

export default function Experience() {
  return (
    <section id="experience" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <span className="text-sm font-medium uppercase tracking-widest text-teal-400">Experience</span>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Timeline</h2>
        </SectionReveal>

        <div className="relative mt-12">
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-white/10 md:left-1/2 md:-ml-px" />

          <div className="space-y-10">
            {experience.map((entry, i) => (
              <SectionReveal key={entry.id} delay={i * 0.08}>
                <div
                  className={`relative flex flex-col gap-4 md:flex-row ${
                    i % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="hidden flex-1 md:block" />
                  <div className="absolute left-0 top-1 z-10 h-3.5 w-3.5 rounded-full border-2 border-teal-400 bg-[#0a0e17] md:left-1/2 md:-ml-[7px]" />
                  <div className="flex-1 pl-8 md:pl-0">
                    <div
                      className={`rounded-xl border border-white/10 bg-white/[0.02] p-6 ${
                        entry.type === "education" ? "border-violet-500/20" : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-medium text-white">{entry.title}</h3>
                        <span className="text-xs text-zinc-500">{entry.period}</span>
                      </div>
                      <p className="mt-1 text-sm text-teal-400/80">{entry.org}</p>
                      <ul className="mt-4 space-y-2">
                        {entry.bullets.map((b) => (
                          <li key={b} className="flex gap-2 text-sm text-zinc-400">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
