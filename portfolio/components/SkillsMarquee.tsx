import { cn } from "@/lib/utils";
import Marquee from "./ui/marquee";

const marqueeSkills = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "FastAPI",
  "SQL",
  "Cybersecurity",
  "Linux",
  "MongoDB",
  "Git",
  "REST APIs",
  "Tailwind CSS",
];

interface SkillsMarqueeProps {
  embedded?: boolean;
}

export default function SkillsMarquee({ embedded = false }: SkillsMarqueeProps) {
  const Tag = embedded ? "div" : "section";

  return (
    <Tag
      id="skills"
      className={cn(
        "relative z-20 w-full overflow-hidden border-y border-[var(--color-slate)] bg-[var(--color-charcoal)] isolate",
        embedded ? "py-4" : "scroll-mt-28 py-8",
      )}
    >
      <div className={cn("text-center", embedded ? "mb-2" : "mb-4 px-6")}>
        <span className="section-kicker">Technical skills</span>
      </div>

      <div className="relative w-full">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--color-charcoal)] to-transparent sm:w-20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--color-charcoal)] to-transparent sm:w-20"
          aria-hidden
        />

        <Marquee pauseOnHover className="w-full [--duration:35s]">
          {marqueeSkills.map((skill) => (
            <span
              key={skill}
              className="mx-2 shrink-0 whitespace-nowrap text-sm font-medium text-[var(--color-paper)] sm:text-base"
            >
              {skill}
              <span className="mx-4 text-[var(--color-stone)]" aria-hidden>
                •
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </Tag>
  );
}
