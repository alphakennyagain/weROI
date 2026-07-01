import { User } from "lucide-react";
import GithubIcon from "@/components/ui/GithubIcon";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import { profile } from "@/content/profile";
import { resumeLinks } from "@/content/resumeLinks";

export default function ResumeContent() {
  return (
    <article lang="en" className="resume-document mx-auto max-w-[8.5in] bg-white px-8 py-10 text-[#111] sm:px-12">
      <header className="text-center">
        <h1 className="text-[1.65rem] font-bold tracking-[0.06em] text-[#111]">ZACHARY HUTTON</h1>
        <p className="mt-2 text-[0.85rem] leading-relaxed text-[#333]">
          {profile.contact.location} |{" "}
          <a
            href={resumeLinks.email}
            className="text-[#111] underline-offset-2 hover:underline"
          >
            {profile.contact.email}
          </a>{" "}
          |{" "}
          <a href={resumeLinks.phone} className="text-[#111] underline-offset-2 hover:underline">
            (876) 781-0400
          </a>
        </p>
        <p className="mt-1 text-[0.85rem] text-[#333]">
          <a
            href={resumeLinks.portfolio}
            className="inline-flex items-center gap-1 text-[#111] underline-offset-2 hover:underline"
          >
            <User size={12} aria-hidden />
            Portfolio
          </a>
          {" | "}
          <a
            href={resumeLinks.github}
            className="inline-flex items-center gap-1 text-[#111] underline-offset-2 hover:underline"
          >
            <GithubIcon size={12} aria-hidden />
            GitHub
          </a>
          {" | "}
          <a
            href={resumeLinks.linkedin}
            className="inline-flex items-center gap-1 text-[#111] underline-offset-2 hover:underline"
          >
            <LinkedinIcon size={12} aria-hidden />
            LinkedIn
          </a>
          {" | "}
          <a
            href={resumeLinks.instagram}
            className="inline-flex items-center gap-1 text-[#111] underline-offset-2 hover:underline"
          >
            Instagram
          </a>
        </p>
      </header>

      <hr className="my-5 border-[#ccc]" />

      <section>
        <h2 className="resume-section-title">Education</h2>
        <div className="flex flex-wrap justify-between gap-2 text-[0.92rem]">
          <p>
            <span className="font-semibold">Currently pursuing BSc in Computer Science</span>, University of
            Technology, Jamaica
          </p>
          <span className="text-[0.85rem] text-[#444]">Sep 2025 - May 2029 (expected)</span>
        </div>
        <p className="mt-1 text-[0.88rem] font-semibold">GPA: 3.7 | Dean&apos;s List</p>
        <p className="mt-3 text-[0.85rem] text-[#444]">
          <span className="font-semibold text-[#333]">Ardenne High School</span> | Sep 2020 - Jul 2025
        </p>
        <p className="mt-0.5 text-[0.85rem] text-[#444]">CSEC: Grade I across subjects</p>
        <p className="mt-0.5 text-[0.72rem] leading-snug text-[#666]">
          IT, English A, Math, Add. Math, Physics, POB, POA, Industrial Tech (Electrical), Social Studies
        </p>
      </section>

      <hr className="my-5 border-[#ccc]" />

      <section>
        <h2 className="resume-section-title">Projects</h2>

        <div className="mt-3 space-y-4 text-[0.88rem] leading-relaxed">
          <div>
            <p className="font-semibold">
              PNTCOG Ministry Platform{" "}
              <span className="font-normal text-[0.82rem] text-[#555]">(portmorentcog.org)</span>
            </p>
            <p className="mt-1">
              Architected a multi-section <strong>React</strong> ministry website with events, giving, prayer requests,
              media, and a Jubilee anniversary hub. Structured modular page components for team-friendly content updates
              and <strong>mobile-first</strong> navigation.
            </p>
            <p className="mt-1">
              Implemented <strong>responsive layouts</strong> across content-heavy pages with performance-focused
              delivery on <strong>Vercel</strong>. Built accessible form flows and a scalable{" "}
              <strong>component architecture</strong> for a live congregation audience.
            </p>
          </div>

          <div>
            <p className="font-semibold">
              weROI Agency Platform <span className="font-normal text-[0.82rem] text-[#555]">(weroi.net)</span>
            </p>
            <p className="mt-1">
              Engineered a full-stack agency platform: <strong>React</strong> / <strong>TypeScript</strong> SPA frontend,{" "}
              <strong>FastAPI</strong>/<strong>Python</strong> backend, and <strong>MongoDB Atlas</strong>{" "}
              persistence. Designed document models for leads, audits, and admin users.
            </p>
            <p className="mt-1">
              Integrated lead-capture funnels, multi-step audit forms, and an <strong>admin dashboard</strong> with{" "}
              <strong>JWT</strong> authentication. Built <strong>RESTful APIs</strong> for lead management and
              connected <strong>Resend</strong> for transactional email.
            </p>
            <p className="mt-1">
              Deployed frontend on <strong>Vercel</strong> and API on <strong>Railway</strong> with{" "}
              <strong>CORS</strong>, environment configuration, and health-check routing.
            </p>
          </div>

          <div>
            <p className="font-semibold">
              StudySync API <span className="font-normal text-[0.82rem] text-[#555]">(Personal)</span>
            </p>
            <p className="mt-1">
              Developed a <strong>FastAPI</strong> <strong>REST API</strong> with <strong>JWT authentication</strong>,{" "}
              <strong>SQLAlchemy</strong> ORM, and course deadline tracking endpoints. Used{" "}
              <strong>Pydantic</strong> schemas for request validation and OpenAPI documentation.
            </p>
          </div>

          <div>
            <p className="font-semibold">
              Webhook Relay API <span className="font-normal text-[0.82rem] text-[#555]">(Personal)</span>
            </p>
            <p className="mt-1">
              Built a developer sandbox API with API-key auth, HMAC-signed <strong>webhook</strong> delivery, retry
              backoff, and per-key <strong>rate limiting</strong> for testing outbound integrations.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-5 border-[#ccc]" />

      <section>
        <h2 className="resume-section-title">Experience</h2>
        <div className="mt-3 space-y-3 text-[0.88rem]">
          <div>
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-semibold">Software Developer (Contract), weROI</p>
              <span className="text-[0.85rem] text-[#444]">2024-Present</span>
            </div>
            <p className="mt-1 leading-relaxed">
              Delivered production web applications using <strong>React</strong>, <strong>Next.js</strong>,{" "}
              <strong>FastAPI</strong>, and <strong>MongoDB</strong>. Implemented <strong>REST APIs</strong>,
              authentication patterns, and deployment on <strong>Vercel</strong> and <strong>Railway</strong>.
            </p>
          </div>
          <div>
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-semibold">Freelance Web Developer, Independent</p>
              <span className="text-[0.85rem] text-[#444]">2023-Present</span>
            </div>
            <p className="mt-1 leading-relaxed">
              Developed responsive websites with <strong>component-based</strong> architecture, <strong>SEO</strong>,
              and performance optimization for local businesses.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-5 border-[#ccc]" />

      <section>
        <h2 className="resume-section-title">Achievements</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[0.88rem] leading-relaxed">
          <li>Dean&apos;s List, UTech BSc Computer Science (GPA 3.7)</li>
          <li>Senior church volunteer and Jamaica Red Cross volunteer</li>
          <li>Contract and freelance delivery for ministry and agency clients</li>
        </ul>
      </section>

      <hr className="my-5 border-[#ccc]" />

      <section>
        <h2 className="resume-section-title">Technical Skills</h2>
        <div className="mt-3 space-y-2 text-[0.85rem] leading-relaxed">
          <p>
            <span className="font-semibold">Languages;</span> Proficient in <strong>Python</strong>;{" "}
            <strong>JavaScript</strong>; <strong>TypeScript</strong>; <strong>Java</strong>; strong{" "}
            <strong>SQL</strong>; proficiency in <strong>HTML5/CSS3</strong>
          </p>
          <p>
            <span className="font-semibold">Frameworks;</span> <strong>React</strong>;{" "}
            <strong>Next.js</strong>; <strong>FastAPI</strong>; <strong>Node.js</strong>;{" "}
            <strong>Express</strong>; <strong>Tailwind CSS</strong>
          </p>
          <p>
            <span className="font-semibold">Backend &amp; data;</span> <strong>RESTful APIs</strong>;{" "}
            <strong>MongoDB</strong>; <strong>MongoDB Atlas</strong>; <strong>SQLite</strong>;{" "}
            <strong>SQLAlchemy</strong>; <strong>JWT authentication</strong>; <strong>Pydantic</strong>{" "}
            validation; <strong>OWASP</strong>-aligned secure coding
          </p>
          <p>
            <span className="font-semibold">Tools;</span> <strong>Git</strong>; <strong>GitHub</strong>;{" "}
            <strong>GitHub Actions</strong>; <strong>Vercel</strong>; <strong>Railway</strong>;{" "}
            <strong>MongoDB Atlas</strong>; <strong>Postman</strong>; <strong>Insomnia</strong>;{" "}
            <strong>Docker</strong> (basics); <strong>VS Code</strong>; <strong>Cursor</strong>;{" "}
            <strong>npm</strong>; <strong>pnpm</strong>; <strong>Resend</strong>; <strong>Figma</strong>;{" "}
            <strong>Linux CLI</strong>; <strong>Wireshark</strong> (basics); <strong>Chrome DevTools</strong>;{" "}
            <strong>ESLint</strong>; <strong>Prettier</strong>; <strong>Calendly</strong> embeds
          </p>
          <p>
            <span className="font-semibold">Practices;</span> <strong>Responsive layouts</strong>;{" "}
            <strong>component architecture</strong>; <strong>state management</strong>;{" "}
            <strong>CI/CD</strong> pipelines; <strong>API design</strong>; <strong>OpenAPI</strong> documentation
          </p>
        </div>
      </section>
    </article>
  );
}

