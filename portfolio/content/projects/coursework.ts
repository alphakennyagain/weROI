import type { Project } from "../types";

export const courseworkProjects: Project[] = [
  {
    id: "ds-algorithms-lab",
    title: "Data Structures & Algorithms Lab",
    type: "coursework",
    problem: "Implement core ADTs and analyse time complexity.",
    description:
      "Java implementations of linked lists, stacks, queues, binary search trees, and sorting algorithms with Big-O analysis write-ups.",
    stack: ["Java", "JUnit", "Big-O analysis"],
    featured: true,
  },
  {
    id: "database-systems",
    title: "Database Systems Project",
    type: "coursework",
    problem: "Model a real domain with normalized schema and queries.",
    description:
      "Library management system with ER diagram, 3NF schema, SQL queries, and a simple Python front-end for CRUD operations.",
    stack: ["SQL", "PostgreSQL", "Python", "ER modelling"],
  },
  {
    id: "networking-lab",
    title: "Computer Networks Lab",
    type: "coursework",
    problem: "Understand packet flow and protocol behaviour hands-on.",
    description:
      "Wireshark capture analysis, subnetting exercises, and a client-server socket program demonstrating TCP handshake and error handling.",
    stack: ["Wireshark", "Python sockets", "TCP/IP"],
  },
  {
    id: "oop-systems",
    title: "OOP Systems Design",
    type: "coursework",
    problem: "Apply design patterns to a multi-class software system.",
    description:
      "Inventory management app using inheritance, interfaces, and the Strategy pattern — with UML diagrams and unit tests.",
    stack: ["Java", "UML", "Design patterns"],
  },
];
