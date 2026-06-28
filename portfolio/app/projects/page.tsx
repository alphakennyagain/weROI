import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsGrid from "@/components/ProjectsGrid";
import BlurText from "@/components/ui/BlurText";

export const metadata: Metadata = {
  title: "Projects · Zachary Hutton",
  description:
    "Contract delivery, personal APIs, and coursework labs. Full project grid with case studies for weROI, PNTCOG, StudySync, and more.",
};

export default function ProjectsPage() {
  return (
    <div>
      <Navbar variant="standalone" />
      <main className="px-6 pb-24 pt-28">
        <div className="mx-auto max-w-[var(--page-max-width)] text-center">
          <span className="section-kicker">Work</span>
          <BlurText
            text="All projects"
            className="mt-3 text-4xl font-medium tracking-[-0.02em] text-[var(--color-paper)] sm:text-5xl"
            delay={80}
          />
          <p className="mx-auto mt-4 max-w-2xl text-[var(--color-pearl)]">
            Contract delivery, API integrations, coursework labs, and personal repositories. Select a project
            for the full case study.
          </p>
          <Link href="/" className="btn-ghost mt-6 inline-flex text-sm">
            ← Back to home
          </Link>
        </div>
        <ProjectsGrid className="mt-14" linkToCaseStudy />
      </main>
      <Footer />
    </div>
  );
}
