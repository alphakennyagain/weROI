import SectionReveal from "./SectionReveal";
import BlurText from "./ui/BlurText";
import { experience } from "@/content/experience";

export default function Experience() {
  return (
    <section id="experience" className="page-section border-t border-[var(--color-slate)] bg-[var(--color-charcoal)] px-6">
      <div className="mx-auto max-w-[var(--page-max-width)] text-center">
        <SectionReveal>
          <span className="section-kicker">Experience</span>
          <BlurText
            text="Where I've built"
            className="mt-4 text-4xl font-medium tracking-[-0.02em] text-[var(--color-paper)] sm:text-5xl"
            delay={90}
          />
        </SectionReveal>

        <div className="mt-12 space-y-4 text-left">
          {experience.map((entry, i) => (
            <SectionReveal key={entry.id} delay={i * 0.06}>
              <div className="surface-card flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                <div>
                  <h3 className="text-base font-medium text-[var(--color-paper)]">{entry.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-ash)]">{entry.org}</p>
                </div>
                <div className="sm:max-w-xl sm:text-right">
                  <span className="text-xs text-[var(--color-stone)]">{entry.period}</span>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-pearl)] sm:text-left">
                    {entry.bullets[0]}
                  </p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
