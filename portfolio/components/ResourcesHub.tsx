import { ExternalLink } from "lucide-react";
import SectionReveal from "./SectionReveal";
import BlurText from "./ui/BlurText";
import { currentlyConsuming, resourceCategories } from "@/content/resources";

const deckRotations = ["-2deg", "1deg", "-1deg", "2deg"];

export default function ResourcesHub() {
  return (
    <section id="resources" className="border-t border-[var(--color-slate)] bg-[var(--color-charcoal)] px-6 py-24">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <SectionReveal>
          <span className="section-kicker">Resources</span>
          <BlurText
            text="Operating system"
            className="mt-4 text-4xl font-medium tracking-[-0.02em] text-[var(--color-paper)] sm:text-5xl"
            delay={90}
          />
          <p className="mt-4 max-w-lg text-[var(--color-pearl)]">
            Docs, courses, tools, and communities I actually use — curated, not blogged.
          </p>
        </SectionReveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="relative min-h-[420px]">
            {resourceCategories.slice(0, 2).map((cat, i) => (
              <SectionReveal key={cat.name} delay={i * 0.1}>
                <div
                  className="deck-card absolute inset-x-0 surface-card p-6"
                  style={{
                    top: `${i * 28}px`,
                    transform: `rotate(${deckRotations[i]})`,
                    zIndex: i + 1,
                  }}
                >
                  <h3 className="text-lg font-medium text-[var(--color-paper)]">{cat.name}</h3>
                  <ul className="mt-4 space-y-2">
                    {cat.links.slice(0, 4).map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-2 text-sm text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                        >
                          <span>{link.name}</span>
                          <ExternalLink
                            size={12}
                            className="shrink-0 text-[var(--color-stone)] opacity-0 transition group-hover:opacity-100"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionReveal>
            ))}
          </div>

          <div className="relative min-h-[420px]">
            {resourceCategories.slice(2).map((cat, i) => (
              <SectionReveal key={cat.name} delay={(i + 2) * 0.1}>
                <div
                  className="deck-card absolute inset-x-0 surface-card p-6"
                  style={{
                    top: `${i * 28}px`,
                    transform: `rotate(${deckRotations[i + 2]})`,
                    zIndex: i + 1,
                  }}
                >
                  <h3 className="text-lg font-medium text-[var(--color-paper)]">{cat.name}</h3>
                  <ul className="mt-4 space-y-2">
                    {cat.links.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-2 text-sm text-[var(--color-pearl)] transition hover:text-[var(--color-paper)]"
                        >
                          <div>
                            <span>{link.name}</span>
                            {link.description && (
                              <span className="ml-2 text-[10px] text-[var(--color-stone)]">
                                {link.description}
                              </span>
                            )}
                          </div>
                          <ExternalLink
                            size={12}
                            className="shrink-0 text-[var(--color-stone)] opacity-0 transition group-hover:opacity-100"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>

        <SectionReveal delay={0.3}>
          <div className="mt-24 rounded-[var(--radius-cards)] border border-[var(--color-slate)] bg-[var(--color-graphite)] p-6">
            <h3 className="text-xs uppercase tracking-widest text-[var(--color-ash)]">
              Currently reading / watching
            </h3>
            <ul className="mt-4 flex flex-wrap gap-3">
              {currentlyConsuming.map((item) => (
                <li
                  key={item.title}
                  className="rounded-full border border-[var(--color-slate)] bg-[var(--color-charcoal)] px-4 py-2 text-sm text-[var(--color-pearl)]"
                >
                  <span className="text-[var(--color-stone)]">{item.type}</span> · {item.title}
                </li>
              ))}
            </ul>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
