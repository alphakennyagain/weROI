const fs = require("fs");
const path = require("path");
const root = "C:/Users/EverybodyHatesA1one/Documents/WEROI/portfolio";
const U = {
  "content/case-studies/studysync-api.ts": [
    "Python", "FastAPI", "SQL", "SQLite", "JWT", "Pydantic", "REST APIs", "OpenAPI", "pytest", "Uvicorn",
    "SQLAlchemy", "bcrypt", "Dependency injection", "Postman", "CRUD APIs", "Password hashing",
  ],
  "content/case-studies/webhook-relay-api.ts": [
    "Python", "FastAPI", "JavaScript", "HMAC", "JSON", "REST APIs", "Middleware", "Redis", "Webhooks",
    "API keys", "Exponential backoff", "Token bucket rate limiting", "OpenAPI", "Async HTTP",
    "Dead-letter logging", "Delivery replay",
  ],
  "content/case-studies/openapi-devkit.ts": [
    "TypeScript", "Node.js", "JavaScript", "OpenAPI 3", "CLI", "Zod", "Code generation", "Fetch API",
    "Postman collections", "JSON Schema", "$ref resolution", "Runtime validation", "Dry-run mode",
  ],
  "content/case-studies/phone-store-api.ts": [
    "TypeScript", "Node.js", "Express", "JavaScript", "MongoDB", "REST APIs", "JSON", "JWT", "Refresh tokens",
    "express-rate-limit", "HMAC webhooks", "Inventory reservation", "Cart API", "Checkout flows",
    "Password hashing", "Pagination", "Order status pipeline",
  ],
  "content/case-studies/weroi.ts": [
    "React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Framer Motion", "GSAP", "React Router",
    "Radix UI", "react-hook-form", "Zod", "FastAPI", "Python", "Pydantic", "MongoDB Atlas", "REST APIs", "JWT",
    "Resend", "APScheduler", "Vercel", "Railway", "CORS", "Admin dashboard", "Lead capture", "Multi-step forms",
    "Analytics events",
  ],
  "content/case-studies/pntcog.ts": [
    "React", "JavaScript", "HTML5", "CSS3", "TypeScript", "Responsive design", "Mobile-first UI",
    "Component architecture", "React Router", "Vercel", "Git", "GitHub", "SEO meta tags", "Accessible forms",
    "Image optimization", "Preview deployments",
  ],
};

for (const [rel, items] of Object.entries(U)) {
  const p = path.join(root, rel);
  const t = fs.readFileSync(p, "utf8");
  const block = "  stack: [\n" + items.map((i) => `    "${i}",`).join("\n") + "\n  ],";
  const t2 = t.replace(/  stack: \[[\s\S]*?\],/, block);
  fs.writeFileSync(p, t2);
  console.log(rel, t !== t2);
}
