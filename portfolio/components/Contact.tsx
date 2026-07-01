import { ArrowUpRight, Code2, Mail, UserRound } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import SectionReveal from "./SectionReveal";
import BlurText from "./ui/BlurText";
import { profile } from "@/content/profile";

const channelClass =
  "group flex cursor-pointer items-center gap-4 surface-card p-5 transition hover:border-[var(--color-electric-indigo)] hover:bg-[var(--color-graphite)]";

export default function Contact() {
  return (
    <section id="contact" className="page-section border-t border-[var(--color-slate)] bg-[var(--color-charcoal)] px-6">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="grid gap-16 text-center lg:grid-cols-2 lg:text-left">
          <SectionReveal>
            <span className="section-kicker">Contact</span>
            <BlurText
              text="Let's connect."
              className="mt-4 text-5xl font-medium tracking-[-0.02em] text-[var(--color-paper)] sm:text-6xl"
              delay={100}
            />
            <p className="mt-6 max-w-md text-[var(--color-pearl)]">
              Open to internships, co-ops, and junior roles in software development, web engineering,
              and IT.
            </p>
            <p className="mt-3 text-sm text-[var(--color-ash)]">Click a channel below to reach me.</p>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div className="mx-auto max-w-md space-y-3 text-left lg:mx-0">
              <a href={`mailto:${profile.contact.email}`} className={channelClass}>
                <Mail className="text-[var(--color-electric-indigo)]" size={22} aria-hidden />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-stone)]">Email</div>
                  <div className="text-[var(--color-paper)] transition group-hover:text-[var(--color-pearl)]">
                    {profile.contact.email}
                  </div>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-[var(--color-stone)] transition group-hover:text-[var(--color-paper)]"
                  aria-hidden
                />
              </a>

              <a
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className={channelClass}
              >
                <Code2 className="text-[var(--color-electric-indigo)]" size={22} aria-hidden />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-stone)]">GitHub</div>
                  <div className="text-[var(--color-paper)] transition group-hover:text-[var(--color-pearl)]">
                    @zacharyahutton
                  </div>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-[var(--color-stone)] transition group-hover:text-[var(--color-paper)]"
                  aria-hidden
                />
              </a>

              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={channelClass}
              >
                <UserRound className="text-[var(--color-electric-indigo)]" size={22} aria-hidden />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-stone)]">LinkedIn</div>
                  <div className="text-[var(--color-paper)] transition group-hover:text-[var(--color-pearl)]">
                    Zachary Hutton
                  </div>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-[var(--color-stone)] transition group-hover:text-[var(--color-paper)]"
                  aria-hidden
                />
              </a>

              <a
                href={profile.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={channelClass}
              >
                <InstagramIcon className="text-[var(--color-electric-indigo)]" size={22} />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-stone)]">Instagram</div>
                  <div className="text-[var(--color-paper)] transition group-hover:text-[var(--color-pearl)]">
                    @zachahutton
                  </div>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-[var(--color-stone)] transition group-hover:text-[var(--color-paper)]"
                  aria-hidden
                />
              </a>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
