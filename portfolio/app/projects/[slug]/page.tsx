import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { getCaseStudySlugs, getProjectBySlug } from "@/content/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project?.caseStudy) return { title: "Project · Zachary Hutton" };
  return {
    title: `${project.title} · Case Study`,
    description: project.caseStudy.overview,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project?.caseStudy) notFound();

  return (
    <div>
      <Navbar variant="standalone" />
      <main className="px-6 pb-24 pt-28">
        <CaseStudyLayout project={project} caseStudy={project.caseStudy} />
      </main>
      <Footer />
    </div>
  );
}
