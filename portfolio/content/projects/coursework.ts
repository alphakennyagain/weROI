import type { Project } from "../types";

export const courseworkProjects: Project[] = [
  {
    id: "ds-bst-lab",
    slug: "ds-bst-lab",
    title: "Binary Search Tree Lab",
    type: "coursework",
    problem: "Implement and analyse core tree operations for the Data Structures course.",
    description:
      "UTech lab covering BST insert, delete, traversal (in/pre/post-order), and height balancing concepts. Includes written complexity analysis. Representative coursework, not proprietary exam content.",
    stack: [
      "Java",
      "JUnit",
      "Algorithms",
      "Data structures",
      "Binary search trees",
      "Big-O analysis",
      "Unit testing",
    ],
    github: "https://github.com/zacharyahutton/ds-java-labs",
    image: "/case-studies/ds-bst-lab-cover.png",
    featured: true,
  },
  {
    id: "db-library-system",
    slug: "db-library-system",
    title: "Library Management DB",
    type: "coursework",
    problem: "Design a normalized relational schema for a campus library system.",
    description:
      "Database Systems project: ER diagram, 3NF schema, SQL queries for borrowing workflows, and a simple Python CLI front-end for CRUD operations.",
    stack: [
      "SQL",
      "PostgreSQL",
      "Python",
      "ER modelling",
      "3NF schema design",
      "Relational queries",
      "CLI",
    ],
    image: "/case-studies/db-library-cover.png",
  },
  {
    id: "prog-fund-algorithms",
    slug: "prog-fund-algorithms",
    title: "Algorithm Analysis Portfolio",
    type: "coursework",
    problem: "Demonstrate sorting and searching implementations with measured performance.",
    description:
      "Programming Fundamentals coursework comparing bubble, merge, and quicksort on varying input sizes. Includes timing benchmarks and written reflection on trade-offs.",
    stack: [
      "Python",
      "Algorithms",
      "Sorting",
      "Searching",
      "Benchmarking",
      "Time complexity",
      "Performance analysis",
    ],
    image: "/case-studies/prog-fund-algorithms-cover.png",
  },
  {
    id: "cyber-network-hardening",
    slug: "cyber-network-hardening",
    title: "Network Hardening Report",
    type: "coursework",
    problem: "Apply introductory security concepts to a small office network scenario.",
    description:
      "Intro to IT Security lab: threat model for a 5-machine LAN, recommended firewall rules, patch policy, and password hygiene checklist. Academic exercise, not a live pentest.",
    stack: [
      "Networking",
      "Linux",
      "Security policy",
      "Firewall rules",
      "Threat modelling",
      "Patch management",
      "Documentation",
    ],
    image: "/case-studies/cyber-network-cover.png",
  },
];
