import type { Project } from "../types";

export const professionalProjects: Project[] = [
  {
    id: "weroi-platform",
    title: "weROI Agency Platform",
    type: "professional",
    problem: "Give a Jamaican digital agency a conversion-focused web presence.",
    description:
      "Full-stack marketing site with case studies, audit funnel, and service pages. One pillar of my professional delivery — not my whole identity.",
    stack: ["React", "Tailwind CSS", "Framer Motion"],
    live: "https://weroi.net",
    featured: true,
  },
  {
    id: "bookit-ja",
    title: "BookIt JA",
    type: "professional",
    problem: "Jamaican service businesses needed booking and delivery in one flow.",
    description:
      "Appointment booking and delivery platform with order management, driver dispatch, and live status tracking.",
    stack: ["React", "Node.js", "MongoDB"],
    live: "https://book-it-jamaica.preview.emergentagent.com",
  },
  {
    id: "pntcog",
    title: "PNTCOG",
    type: "professional",
    problem: "A church community needed a digital hub for events, giving, and media.",
    description:
      "Ministry site with Jubilee anniversary hub, prayer requests, events calendar, and team-friendly content updates.",
    stack: ["React", "CMS", "Responsive design"],
    live: "https://portmorentcog.org",
  },
  {
    id: "shipping-district",
    title: "The Shipping District",
    type: "professional",
    problem: "Florida-to-Jamaica courier needed live tracking and fleet ops.",
    description:
      "Customer accounts, package tracking, and a back-office fleet operations dashboard for logistics staff.",
    stack: ["React", "FastAPI", "MongoDB"],
    live: "https://freight-fleet-ops.preview.emergentagent.com",
  },
];
