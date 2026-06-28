import SectionReveal from "./SectionReveal";
import { profile } from "@/content/profile";

export default function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <span className="text-sm font-medium uppercase tracking-widest text-teal-400">About</span>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Building depth, not just demos</h2>
        </SectionReveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            {profile.about.map((para, i) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <p className="leading-relaxed text-zinc-400">{para}</p>
              </SectionReveal>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2">
            {profile.stats.map((stat, i) => (
              <SectionReveal key={stat.label} delay={i * 0.06}>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="font-serif text-xl text-teal-300">{stat.value}</div>
                  <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
