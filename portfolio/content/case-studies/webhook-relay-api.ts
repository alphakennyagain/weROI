import type { CaseStudy } from "../types";

export const webhookRelayApiCaseStudy: CaseStudy = {
  overview:
    "Developer sandbox API that registers webhook endpoints, signs outbound payloads, retries failed deliveries, and enforces per-key rate limits for integration testing.",
  problem:
    "When learning third-party integrations, it is hard to observe **retries**, **signature verification**, and **throttling** without standing up multiple services. I needed a small API that behaves like production webhook infrastructure so I could debug consumer-side handlers with realistic delivery behavior.",
  solution:
    "Webhook Relay accepts **API keys**, queues delivery jobs, signs payloads with **HMAC-SHA256**, and retries failed HTTP callbacks with **exponential backoff**. Redis backs the rate limiter and job queue. Delivery logs and replay endpoints let developers inspect failures from a single JSON API.",
  architecture: [
    {
      title: "API Surface",
      items: [
        "FastAPI routes to register webhook URLs, trigger test events, and list delivery history",
        "API-key middleware attaching tenant context to every request",
        "JSON payloads with event type, timestamp, and signed headers for consumer verification",
        "Replay endpoint to resend a failed delivery without re-triggering the upstream event",
      ],
    },
    {
      title: "Delivery Engine",
      items: [
        "Async HTTP client posting signed payloads to registered callback URLs",
        "HMAC-SHA256 signature header so consumers verify integrity before processing",
        "Exponential backoff retry scheduler with configurable attempt budget",
        "Dead-letter logging when deliveries exceed the retry limit",
      ],
    },
    {
      title: "Rate Limiting & Storage",
      items: [
        "Token bucket rate limiter per API key stored in Redis",
        "Separate quotas for registration, trigger, and replay operations",
        "Delivery attempt records persisted for audit and debugging",
        "429 responses with Retry-After hints when quotas are exhausted",
      ],
    },
  ],
  keyDecisions: [
    {
      title: "HMAC signatures on every outbound event",
      description:
        "Production webhooks (Stripe, GitHub, etc.) sign payloads so receivers can detect tampering. I mirrored that pattern with a shared secret per API key. Consumers practice **signature verification** exactly as they would against a real provider.",
    },
    {
      title: "Token bucket limits in Redis",
      description:
        "In-memory counters reset on process restart and fail under multiple workers. **Redis-backed token buckets** give durable per-key quotas and make 429 behavior testable under load without hammering downstream URLs.",
    },
    {
      title: "Exponential backoff with a hard retry cap",
      description:
        "Immediate retries amplify outages. Backoff spacing (1s, 2s, 4s...) gives flaky endpoints time to recover while a **maximum attempt count** prevents infinite loops. Failed jobs land in a dead-letter log for inspection.",
    },
  ],
  metrics: [
    { value: "HMAC", label: "Signed payloads" },
    { value: "Redis", label: "Rate limits" },
    { value: "Retry", label: "Backoff delivery" },
  ],
  stack: [
    "Python",
    "FastAPI",
    "JavaScript",
    "HMAC",
    "JSON",
    "REST APIs",
    "Middleware",
    "Redis",
    "Webhooks",
    "API keys",
    "Exponential backoff",
    "Token bucket rate limiting",
    "OpenAPI",
    "Async HTTP",
    "Dead-letter logging",
    "Delivery replay",
  ],
  screenshots: [{ src: "/case-studies/webhook-relay-cover.png", alt: "Webhook Relay API cover" }],
};
