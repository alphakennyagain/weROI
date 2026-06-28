import type { CaseStudy } from "../types";

export const pntcogCaseStudy: CaseStudy = {
  overview:
    "Production React ministry website for Portmore New Testament Church of God, serving events, giving, prayer requests, media, and a Jubilee 50th anniversary hub.",
  problem:
    "Portmore New Testament Church of God needed a **single digital home** for ministry programmes, event promotion, online giving, and prayer requests. Most members browse on mobile, so pages had to stay readable on small screens. Content also needed to remain easy for **non-technical volunteers** to update without breaking navigation or layout consistency.",
  solution:
    "I architected a **modular React site** with reusable layout shells, route-level page components, and **mobile-first navigation**. Each ministry programme maps to its own section so stakeholders can update copy and imagery independently. The site ships on **Vercel** with preview deployments for review before changes reach the live domain at portmorentcog.org.",
  architecture: [
    {
      title: "Frontend & UX",
      items: [
        "React SPA with page-level components for events, giving, prayer, media, and Jubilee anniversary content",
        "Shared layout primitives (header, footer, section shells) to avoid duplicated chrome across routes",
        "Mobile-first responsive grid with fluid typography and image sizing for content-heavy pages",
        "Accessible form flows for prayer requests and giving with visible validation and keyboard-friendly focus order",
      ],
    },
    {
      title: "Content & Structure",
      items: [
        "Jubilee anniversary hub with timeline storytelling and media gallery sections",
        "Events calendar and programme pages organized for seasonal ministry updates",
        "Modular component architecture so new sections ship without restructuring the whole site",
        "Clear information hierarchy for first-time visitors and returning congregation members",
      ],
    },
    {
      title: "Deployment & Performance",
      items: [
        "Vercel hosting with preview branches for stakeholder sign-off before production promotion",
        "Static asset and route composition tuned for faster first paint on mobile networks",
        "Production domain routing to portmorentcog.org with HTTPS and CDN-backed delivery",
      ],
    },
  ],
  keyDecisions: [
    {
      title: "Component-driven pages over a page builder",
      description:
        "I chose **React components** instead of a drag-and-drop CMS so the site stays fast, version-controlled, and predictable. Ministry sections share layout primitives, which means a header or navigation change propagates everywhere without manual edits on each page.",
    },
    {
      title: "Mobile-first layout system",
      description:
        "Most congregation traffic arrives on phones. I prioritized **readable type scale**, touch-friendly tap targets, and stacked layouts that degrade gracefully before adding desktop enhancements. This kept event and giving flows usable without horizontal scrolling.",
    },
    {
      title: "Preview-before-publish workflow",
      description:
        "Stakeholders needed to review copy and imagery before it went live. **Vercel preview URLs** let volunteers approve changes in a production-like environment, reducing last-minute layout surprises on the public site.",
    },
  ],
  metrics: [
    { value: "Live", label: "Production site" },
    { value: "Mobile-first", label: "Responsive layouts" },
    { value: "Modular", label: "Content sections" },
  ],
  stack: [
    "React",
    "JavaScript",
    "HTML5",
    "CSS3",
    "TypeScript",
    "Responsive design",
    "Mobile-first UI",
    "Component architecture",
    "React Router",
    "Vercel",
    "Git",
    "GitHub",
    "SEO meta tags",
    "Accessible forms",
    "Image optimization",
    "Preview deployments",
  ],
  screenshots: [{ src: "/case-studies/pntcog.png", alt: "PNTCOG 50th Jubilee logo — gold 50, cross, and globe" }],
};
