import { Code2, Mail, MapPin, UserRound } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { profile } from "@/content/profile";

export default function Contact() {
  return (
    <section id="contact" className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <span className="text-sm font-medium uppercase tracking-widest text-teal-400">Contact</span>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Let&apos;s connect</h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Open to internships, co-ops, and junior roles in software development, web engineering, and IT.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href={`mailto:${profile.contact.email}`}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-teal-500/30"
            >
              <Mail className="text-teal-400" size={20} />
              <div>
                <div className="text-xs text-zinc-500">Email</div>
                <div className="text-sm text-white">{profile.contact.email}</div>
              </div>
            </a>
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-teal-500/30"
            >
              <Code2 className="text-teal-400" size={20} />
              <div>
                <div className="text-xs text-zinc-500">GitHub</div>
                <div className="text-sm text-white">@alphakennyagain</div>
              </div>
            </a>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-teal-500/30"
            >
              <UserRound className="text-teal-400" size={20} />
              <div>
                <div className="text-xs text-zinc-500">LinkedIn</div>
                <div className="text-sm text-white">Zachary Hutton</div>
              </div>
            </a>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <MapPin className="text-teal-400" size={20} />
              <div>
                <div className="text-xs text-zinc-500">Location</div>
                <div className="text-sm text-white">{profile.contact.location}</div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
