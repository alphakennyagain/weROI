import type { CaseStudy } from "../types";

export const studysyncApiCaseStudy: CaseStudy = {
  overview:
    "FastAPI REST API for tracking coursework modules, deadlines, and study sessions with JWT authentication and SQLAlchemy persistence.",
  problem:
    "I wanted a backend project that mirrors **production API patterns**: authenticated users, validated request bodies, relational data modeling, and **documented endpoints** I could exercise in Postman. The goal was a portfolio-ready service that demonstrates secure CRUD, not a throwaway script.",
  solution:
    "StudySync exposes versioned REST routes for user registration, course modules, and deadline CRUD. **Pydantic schemas** validate every request, **SQLAlchemy models** map to SQLite for local development, and **OpenAPI docs** generate automatically from FastAPI route definitions.",
  architecture: [
    {
      title: "API Layer",
      items: [
        "FastAPI application with router modules for auth, courses, and deadlines",
        "Pydantic request/response models with consistent validation error shapes",
        "Auto-generated OpenAPI schema and interactive /docs for manual testing",
        "Dependency-injected database sessions per request",
      ],
    },
    {
      title: "Auth & Security",
      items: [
        "JWT access tokens issued after password-verified login",
        "Password hashing before persistence (never stored in plain text)",
        "Protected route dependencies that reject missing or expired tokens",
        "User-scoped queries so one account cannot read another user's deadlines",
      ],
    },
    {
      title: "Data Model",
      items: [
        "SQLAlchemy ORM models for users, courses, modules, and deadlines",
        "Relational links between courses and nested deadline records",
        "SQLite database for zero-config local development and demos",
        "Migration-friendly table definitions for future PostgreSQL promotion",
      ],
    },
  ],
  keyDecisions: [
    {
      title: "FastAPI over Flask for typed contracts",
      description:
        "FastAPI's **native Pydantic integration** means request bodies and responses stay typed end to end. Validation errors return structured JSON automatically, which matches what I see in modern Python API codebases and makes Postman testing straightforward.",
    },
    {
      title: "JWT with dependency injection for auth",
      description:
        "Rather than sprinkling auth checks inside every handler, I used FastAPI **dependencies** to decode JWTs once and attach the current user to the request context. Unauthorized calls fail fast with 401 responses before business logic runs.",
    },
    {
      title: "SQLite first, Postgres-ready schema",
      description:
        "SQLite keeps the project easy to clone and run locally. Table definitions and SQLAlchemy relationships are written so swapping the connection string to PostgreSQL later would not require redesigning the domain model.",
    },
  ],
  metrics: [
    { value: "JWT", label: "Secured routes" },
    { value: "OpenAPI", label: "Auto docs" },
    { value: "CRUD", label: "Deadline tracking" },
  ],
  stack: [
    "Python",
    "FastAPI",
    "SQL",
    "SQLite",
    "JWT",
    "Pydantic",
    "REST APIs",
    "OpenAPI",
    "pytest",
    "Uvicorn",
    "SQLAlchemy",
    "bcrypt",
    "Dependency injection",
    "Postman",
    "CRUD APIs",
    "Password hashing",
  ],
  screenshots: [{ src: "/case-studies/studysync-cover.png", alt: "StudySync API dashboard style cover" }],
};
