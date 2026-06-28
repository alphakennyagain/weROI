import type { Project } from "../types";

export const personalProjects: Project[] = [
  {
    id: "cli-task-manager",
    title: "CLI Task Manager",
    type: "personal",
    problem: "Practice file I/O and data persistence without a GUI.",
    description:
      "Python CLI for managing tasks with JSON storage, priority tags, and due-date filtering. Built to reinforce OOP and error handling.",
    stack: ["Python", "JSON", "argparse"],
    github: "https://github.com/alphakennyagain",
    featured: true,
  },
  {
    id: "url-shortener",
    title: "URL Shortener API",
    type: "personal",
    problem: "Learn REST design and database-backed services.",
    description:
      "FastAPI service that generates short links, tracks click counts, and exposes a clean JSON API with input validation.",
    stack: ["Python", "FastAPI", "MongoDB"],
    github: "https://github.com/alphakennyagain",
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    type: "personal",
    problem: "Combine external APIs with a responsive React UI.",
    description:
      "React dashboard pulling live weather data, with geolocation lookup, unit toggles, and skeleton loading states.",
    stack: ["React", "TypeScript", "OpenWeather API"],
    github: "https://github.com/alphakennyagain",
  },
  {
    id: "dev-utilities",
    title: "Dev Utilities Collection",
    type: "personal",
    problem: "Automate repetitive dev workflows from the terminal.",
    description:
      "Small scripts for batch renaming, env-file validation, and git branch cleanup — the kind of tools I reach for weekly.",
    stack: ["Python", "Bash", "Node.js"],
    github: "https://github.com/alphakennyagain",
  },
  {
    id: "portfolio-v2",
    title: "Personal Portfolio",
    type: "personal",
    problem: "Present a multi-pillar engineering identity to recruiters.",
    description:
      "This site — Next.js 15, typed content modules, dark theme, and filterable project grid spanning coursework, security, and client work.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/alphakennyagain",
  },
];
