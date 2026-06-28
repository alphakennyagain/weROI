import type { ResourceCategory } from "./types";

export const resourceCategories: ResourceCategory[] = [
  {
    name: "Documentation",
    links: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org", description: "HTML, CSS, JS reference" },
      { name: "React Docs", url: "https://react.dev", description: "Official React documentation" },
      { name: "Next.js Docs", url: "https://nextjs.org/docs", description: "App Router and deployment" },
      { name: "Python Docs", url: "https://docs.python.org/3/", description: "Standard library reference" },
      { name: "OWASP", url: "https://owasp.org", description: "Web security standards" },
      { name: "FastAPI Docs", url: "https://fastapi.tiangolo.com", description: "Python API framework" },
    ],
  },
  {
    name: "Learning",
    links: [
      { name: "freeCodeCamp", url: "https://freecodecamp.org", description: "Free full-stack curriculum" },
      { name: "CS50", url: "https://cs50.harvard.edu", description: "Harvard intro to CS" },
      { name: "PortSwigger Academy", url: "https://portswigger.net/web-security", description: "Web security labs" },
      { name: "The Odin Project", url: "https://theodinproject.com", description: "Full-stack path" },
      { name: "NeetCode", url: "https://neetcode.io", description: "DSA practice roadmap" },
    ],
  },
  {
    name: "Tools",
    links: [
      { name: "GitHub", url: "https://github.com", description: "Code hosting and CI" },
      { name: "Vercel", url: "https://vercel.com", description: "Frontend deployment" },
      { name: "Railway", url: "https://railway.app", description: "Backend hosting" },
      { name: "Figma", url: "https://figma.com", description: "UI design" },
      { name: "Postman", url: "https://postman.com", description: "API testing" },
      { name: "Notion", url: "https://notion.so", description: "Notes and planning" },
    ],
  },
  {
    name: "Communities",
    links: [
      { name: "Dev.to", url: "https://dev.to", description: "Developer articles and discussion" },
      { name: "r/learnprogramming", url: "https://reddit.com/r/learnprogramming", description: "Beginner-friendly Reddit" },
      { name: "r/netsecstudents", url: "https://reddit.com/r/netsecstudents", description: "Security learning community" },
      { name: "Discord — The Programmer's Hangout", url: "https://discord.gg/programming", description: "Active dev community" },
    ],
  },
];

export const currentlyConsuming = [
  { title: "PortSwigger Web Security Academy", type: "Course" },
  { title: "NeetCode 150 (Python track)", type: "Practice" },
  { title: "Computer Networks — Tanenbaum", type: "Textbook" },
];
