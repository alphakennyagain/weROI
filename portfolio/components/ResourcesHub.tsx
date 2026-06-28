import { ExternalLink } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { currentlyConsuming, resourceCategories } from "@/content/resources";

export default function ResourcesHub() {
  return (
    <section id="resources" className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <span className="text-sm font-medium uppercase tracking-widest text-teal-400">Resources</span>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Personal operating system</h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Docs, courses, tools, and communities I actually use — not a blog, a curated hub.
          </p>
        </SectionReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {resourceCategories.map((cat, i) => (
            <SectionReveal key={cat.name} delay={i * 0.06}>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="font-medium text-white">{cat.name}</h3>
                <ul className="mt-4 space-y-3">
                  {cat.links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="text-sm text-zinc-200 transition group-hover:text-teal-300">
                            {link.name}
                          </div>
                          {link.description && (
                            <div className="text-xs text-zinc-500">{link.description}</div>
                          )}
                        </div>
                        <ExternalLink
                          size={14}
                          className="mt-0.5 shrink-0 text-zinc-600 transition group-hover:text-teal-400"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.2}>
          <div className="mt-10 rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
            <h3 className="text-sm font-medium uppercase tracking-wider text-violet-300">
              Currently reading / watching
            </h3>
            <ul className="mt-4 flex flex-wrap gap-3">
              {currentlyConsuming.map((item) => (
                <li
                  key={item.title}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300"
                >
                  <span className="text-violet-400">{item.type} · </span>
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
