import { Code2, ExternalLink } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { spotlightItems } from "@/content/spotlight";

export default function Spotlight() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <span className="text-sm font-medium uppercase tracking-widest text-teal-400">Spotlight</span>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Three pillars, one story</h2>
        </SectionReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {spotlightItems.map((item, i) => (
            <SectionReveal key={item.id} delay={i * 0.1}>
              <article className="group flex h-full flex-col rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition hover:border-teal-500/30">
                <span className="text-xs font-medium uppercase tracking-wider text-teal-400">{item.pillar}</span>
                <h3 className="mt-3 font-serif text-xl text-white">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.stack.map((s) => (
                    <span key={s} className="rounded bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex gap-3">
                  {item.github && (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-teal-300"
                    >
                      <Code2 size={14} /> Code
                    </a>
                  )}
                  {item.href && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-teal-300"
                    >
                      <ExternalLink size={14} /> Live
                    </a>
                  )}
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
