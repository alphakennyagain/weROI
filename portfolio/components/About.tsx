import SectionReveal from "./SectionReveal";
import BlurText from "./ui/BlurText";
import { csecFootnote, profile } from "@/content/profile";

export default function About() {
  return (
    <section id="about" className="page-section border-t border-[var(--color-slate)] px-6">
      <div className="mx-auto max-w-[var(--page-max-width)] text-center">
        <div className="grid gap-16 lg:grid-cols-2 lg:text-left">
          <SectionReveal>
            <span className="section-kicker">About</span>
            <BlurText
              text="Strong fundamentals, steady growth."
              className="mt-4 text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-[var(--color-paper)] sm:text-5xl"
              delay={80}
            />
            <p className="mx-auto mt-6 max-w-md text-sm text-[var(--color-ash)] lg:mx-0">{profile.headline}</p>
          </SectionReveal>

          <div className="space-y-6 text-left lg:text-left">
            {profile.about.map((para, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <p className="text-base leading-[1.5] text-[var(--color-pearl)]">{para}</p>
              </SectionReveal>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px border border-[var(--color-slate)] bg-[var(--color-slate)] sm:grid-cols-3 lg:grid-cols-5">
          {profile.stats.map((stat, i) => (
            <SectionReveal key={stat.label} delay={i * 0.05}>
              <div className="bg-[var(--color-graphite)] px-5 py-6 text-center lg:text-left">
                <div className="text-xl font-medium text-[var(--color-paper)] sm:text-2xl">{stat.value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-[var(--color-stone)]">
                  {stat.label}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-[var(--color-stone)] lg:text-left">
          {csecFootnote}
        </p>
      </div>
    </section>
  );
}
