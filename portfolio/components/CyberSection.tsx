import { ExternalLink, Shield } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { cybersecurity } from "@/content/cybersecurity";

export default function CyberSection() {
  return (
    <section id="cybersecurity" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <div className="flex items-center gap-2">
            <Shield className="text-teal-400" size={20} />
            <span className="text-sm font-medium uppercase tracking-widest text-teal-400">Cybersecurity</span>
          </div>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Security-aware engineering</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-400">{cybersecurity.narrative}</p>
        </SectionReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <SectionReveal delay={0.1}>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="font-medium text-white">Learning focus</h3>
              <ul className="mt-4 space-y-2">
                {cybersecurity.learningFocus.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-zinc-400">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="font-medium text-white">Tools & environments</h3>
              <ul className="mt-4 space-y-3">
                {cybersecurity.tools.map((tool) => (
                  <li key={tool.name}>
                    <div className="text-sm text-white">{tool.name}</div>
                    <div className="text-xs text-zinc-500">{tool.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="font-medium text-white">Related work</h3>
              <ul className="mt-4 space-y-4">
                {cybersecurity.projects.map((proj) => (
                  <li key={proj.title}>
                    <a
                      href={proj.href}
                      className="group block"
                      {...(proj.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      <div className="flex items-center gap-1 text-sm text-white transition group-hover:text-teal-300">
                        {proj.title}
                        <ExternalLink size={12} className="opacity-0 transition group-hover:opacity-100" />
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">{proj.description}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
