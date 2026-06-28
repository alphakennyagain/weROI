import type { SpotlightItem } from "./types";

export const spotlightItems: SpotlightItem[] = [
  {
    id: "spotlight-personal",
    pillar: "Personal project",
    title: "URL Shortener API",
    description:
      "FastAPI backend with MongoDB persistence, click analytics, and validated REST endpoints — my go-to project for demonstrating backend fundamentals.",
    stack: ["Python", "FastAPI", "MongoDB"],
    github: "https://github.com/alphakennyagain",
  },
  {
    id: "spotlight-coursework",
    pillar: "Coursework",
    title: "Data Structures & Algorithms Lab",
    description:
      "Java implementations of core ADTs with complexity analysis — the foundation I reference when choosing the right structure in production code.",
    stack: ["Java", "Big-O", "JUnit"],
  },
  {
    id: "spotlight-professional",
    pillar: "Professional",
    title: "weROI Agency Platform",
    description:
      "Conversion-focused agency site with case studies and audit funnel. Proof I ship real software for real users — one pillar, not the whole story.",
    stack: ["React", "Tailwind", "Framer Motion"],
    href: "https://weroi.net",
  },
];
