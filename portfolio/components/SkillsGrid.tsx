import SectionReveal from "./SectionReveal";
import { skillCategories } from "@/content/skills";

export default function SkillsGrid() {
  return (
    <section id="skills" className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <span className="text-sm font-medium uppercase tracking-widest text-teal-400">Toolkit</span>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Skills across the stack</h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Six categories — from languages and frameworks to security awareness and engineering practices.
          </p>
        </SectionReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, i) => (
            <SectionReveal key={cat.name} delay={i * 0.05}>
              <div className="h-full rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="font-medium text-white">{cat.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-white/8 bg-white/5 px-2.5 py-1 text-xs text-zinc-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
