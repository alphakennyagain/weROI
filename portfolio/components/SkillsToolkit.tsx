import SectionReveal from "./SectionReveal";
import BlurText from "./ui/BlurText";
import { skillCategories } from "@/content/skills";

export default function SkillsToolkit() {
  return (
    <section id="toolkit" className="page-section border-t border-[var(--color-slate)] px-6">
      <div className="mx-auto max-w-[var(--page-max-width)] text-center">
        <SectionReveal>
          <span className="section-kicker">Skills</span>
          <BlurText
            text="Stack & practices"
            className="mt-3 text-4xl font-medium tracking-[-0.02em] text-[var(--color-paper)] sm:text-5xl"
            delay={80}
          />
          <p className="mx-auto mt-4 max-w-2xl text-[var(--color-pearl)]">
            Languages, frameworks, and tooling I reach for when building APIs, frontends, and production
            deployments.
          </p>
        </SectionReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, i) => (
            <SectionReveal key={category.name} delay={i * 0.08}>
              <article className="surface-card flex h-full flex-col p-6 text-left">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-paper)]">
                  {category.name}
                </h3>
                <ul className="mt-4 space-y-2">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-relaxed text-[var(--color-pearl)]"
                    >
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-electric-indigo)]"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
