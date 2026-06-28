import type { SkillCategory } from "./types";

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "Java", "SQL", "HTML/CSS"],
  },
  {
    name: "Frameworks & libs",
    items: ["React", "Next.js", "FastAPI", "Node.js", "Tailwind CSS", "Three.js"],
  },
  {
    name: "Security & IT",
    items: [
      "Secure coding awareness",
      "Threat modeling basics",
      "Networking fundamentals",
      "Linux CLI",
      "Auth patterns (JWT, sessions)",
      "OWASP Top 10 awareness",
    ],
  },
  {
    name: "Tools & infra",
    items: [
      "Git & GitHub",
      "VS Code / Cursor",
      "Vercel",
      "Railway",
      "MongoDB",
      "Postman",
      "Docker basics",
    ],
  },
  {
    name: "CS fundamentals",
    items: [
      "Data structures",
      "OOP",
      "Databases",
      "REST APIs",
      "Version control",
      "Debugging & profiling",
    ],
  },
  {
    name: "Practices",
    items: [
      "Documentation",
      "Agile workflows",
      "Code review",
      "Test-driven habits",
      "Continuous learning",
      "Client scoping",
    ],
  },
];
