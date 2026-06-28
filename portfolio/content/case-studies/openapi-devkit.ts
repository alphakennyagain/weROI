import type { CaseStudy } from "../types";

export const openapiDevkitCaseStudy: CaseStudy = {
  overview:
    "Node.js CLI that reads OpenAPI 3.x specifications and outputs typed TypeScript clients plus Postman collections for faster API integration.",
  problem:
    "Repeatedly hand-writing **fetch wrappers** for coursework APIs and contract backends was slow and error-prone. Small schema changes silently broke callers because types drifted from the spec. I wanted a generator that enforced request/response shapes directly from the OpenAPI document.",
  solution:
    "OpenAPI DevKit parses spec files, maps operations to typed functions, emits **Zod schemas** for runtime validation, and bundles a **Postman v2.1 collection** for quick manual testing. A dry-run mode prints the planned output tree without writing files.",
  architecture: [
    {
      title: "Spec Ingestion",
      items: [
        "OpenAPI 3.x JSON parser building an internal AST of paths, operations, and schemas",
        "Reference resolution for $ref components across shared schema definitions",
        "Support for query params, path params, request bodies, and response status codes",
        "Validation pass that surfaces unsupported constructs before codegen starts",
      ],
    },
    {
      title: "Code Generation",
      items: [
        "TypeScript modules with fetch-based client functions per operationId",
        "Exported Zod validators mirroring each operation's request body schema",
        "Shared types file for reusable component schemas (User, Error, Pagination)",
        "Configurable output directory and barrel index for clean imports",
      ],
    },
    {
      title: "Developer Workflow",
      items: [
        "CLI entry with --input, --output, and --dry-run flags",
        "Postman collection export with environment variable placeholders for base URL and tokens",
        "Readable error messages when the spec is malformed or missing required fields",
        "Designed for reuse across personal API projects and coursework backends",
      ],
    },
  ],
  keyDecisions: [
    {
      title: "Zod alongside TypeScript types",
      description:
        "Compile-time types disappear at runtime. Generating matching **Zod schemas** lets callers validate API responses in development and tests, catching contract drift when a backend changes field names or optional flags.",
    },
    {
      title: "Fetch-based clients over axios",
      description:
        "Fetch keeps generated clients **dependency-light** and works in modern Node and browser environments without pulling a heavy HTTP library. Each function accepts a base URL and optional headers for auth tokens.",
    },
    {
      title: "Postman export as a first-class artifact",
      description:
        "Typed clients help application code, but manual exploration still matters during integration. Bundling a **Postman collection** alongside generated files gives a one-command path from spec to testable requests.",
    },
  ],
  metrics: [
    { value: "OpenAPI 3", label: "Spec support" },
    { value: "Zod", label: "Runtime validation" },
    { value: "CLI", label: "One-command codegen" },
  ],
  stack: [
    "TypeScript",
    "Node.js",
    "JavaScript",
    "OpenAPI 3",
    "CLI",
    "Zod",
    "Code generation",
    "Fetch API",
    "Postman collections",
    "JSON Schema",
    "$ref resolution",
    "Runtime validation",
    "Dry-run mode",
  ],
  screenshots: [{ src: "/case-studies/openapi-devkit-cover.png", alt: "OpenAPI DevKit cover" }],
};
