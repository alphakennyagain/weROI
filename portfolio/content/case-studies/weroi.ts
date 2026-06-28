import type { CaseStudy } from "../types";

export const weroiCaseStudy: CaseStudy = {
  overview:
    "Full-stack agency platform connecting a React marketing frontend, FastAPI API layer, and MongoDB Atlas persistence for lead capture, analytics, and admin operations.",
  problem:
    "weROI needed a client-facing site that captures leads through **multi-step audit funnels** and guide-download popups, stores submissions reliably, and gives admins a secure way to review incoming opportunities. Email notifications had to fire on submission, and the stack needed to run across **Vercel** (frontend) and **Railway** (API) without exposing secrets.",
  solution:
    "I engineered a **React SPA** for public marketing routes, a **FastAPI** backend with Pydantic-validated REST endpoints, and **MongoDB Atlas** document collections for audit leads, guide leads, and analytics events. Password-protected admin routes expose dashboard data and lead management. **Resend** handles transactional email tied to funnel completion, with health-check endpoints for uptime monitoring.",
  architecture: [
    {
      title: "Frontend",
      items: [
        "React SPA with marketing pages, multi-step audit forms, and guide-download capture modals",
        "Client-side funnel state with step validation before submission to the API",
        "Admin dashboard views gated behind session authentication",
        "Analytics event tracking for page views, funnel starts, and popup interactions",
      ],
    },
    {
      title: "Backend & Data",
      items: [
        "FastAPI router mounted at /api with Pydantic request/response models",
        "MongoDB collections: audit_leads, guide_leads, analytics_events, status_checks",
        "Lead routes: POST /leads/audit, POST /leads/guide, GET stats and recent lead lists",
        "Analytics aggregation for unique visitors, page views, and funnel conversion rates",
        "Lazy MongoDB initialization so /api/health stays available even during connection issues",
      ],
    },
    {
      title: "Auth, Email & Ops",
      items: [
        "Admin authentication via POST /admin/auth with password verification",
        "Protected lead update and delete routes requiring admin credentials",
        "Resend integration for audit confirmation, growth audit, and owner notification emails",
        "Background email sequences for guide leads after popup submission",
        "Railway deployment with CORS configuration and environment-based secrets",
      ],
    },
  ],
  keyDecisions: [
    {
      title: "Document store for lead funnels",
      description:
        "Audit and guide submissions carry **variable fields** (services interested, referrer, timeline). MongoDB documents map naturally to these shapes without rigid migrations every time the funnel adds a question. Lead stats and recent lists query directly from the same collections admins manage.",
    },
    {
      title: "Split frontend and API deployment",
      description:
        "The React app ships on **Vercel** for fast global static delivery while the FastAPI service runs on **Railway** close to MongoDB Atlas. CORS and environment variables keep the boundary explicit. A dedicated /api/health endpoint supports platform health checks without requiring a database ping to succeed.",
    },
    {
      title: "Awaited email delivery on audit submit",
      description:
        "Audit confirmations and owner notifications send **before the HTTP response returns** so emails are not dropped if the worker recycles immediately after responding. Guide leads use background tasks for multi-step sequences where latency is acceptable.",
    },
    {
      title: "Built-in analytics over third-party-only tracking",
      description:
        "Session-scoped analytics events stored in MongoDB power funnel conversion metrics (audit starts vs submits, popup shown vs captured) without relying solely on external dashboards. Referrer aggregation helps attribute leads back to campaigns.",
    },
  ],
  metrics: [
    { value: "Multi-step", label: "Audit funnels" },
    { value: "JWT-ready", label: "Admin access" },
    { value: "Resend", label: "Transactional email" },
  ],
  stack: [
    "React",
    "JavaScript",
    "TypeScript",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Framer Motion",
    "GSAP",
    "React Router",
    "Radix UI",
    "react-hook-form",
    "Zod",
    "FastAPI",
    "Python",
    "Pydantic",
    "MongoDB Atlas",
    "REST APIs",
    "JWT",
    "Resend",
    "APScheduler",
    "Vercel",
    "Railway",
    "CORS",
    "Admin dashboard",
    "Lead capture",
    "Multi-step forms",
    "Analytics events",
  ],
  screenshots: [{ src: "/case-studies/weroi.png", alt: "weROI agency platform dashboard" }],
};
