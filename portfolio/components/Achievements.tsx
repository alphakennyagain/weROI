import SectionReveal from "./SectionReveal";
import BlurText from "./ui/BlurText";
import { achievements } from "@/content/achievements";

export default function Achievements() {
  return (
    <section id="achievements" className="page-section px-6">
      <div className="mx-auto max-w-[var(--page-max-width)] text-center">
        <SectionReveal>
          <span className="section-kicker">Recognition</span>
          <BlurText
            text="Achievements"
            className="mt-4 text-4xl font-medium tracking-[-0.02em] text-[var(--color-paper)] sm:text-5xl"
            delay={80}
          />
        </SectionReveal>

        <div className="mt-12 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, i) => (
            <SectionReveal key={item.title} delay={i * 0.06}>
              <article className="surface-card h-full p-6">
                <h3 className="text-lg font-medium text-[var(--color-paper)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-pearl)]">{item.description}</p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
