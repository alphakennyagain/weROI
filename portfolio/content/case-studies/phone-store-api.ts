import type { CaseStudy } from "../types";

export const phoneStoreApiCaseStudy: CaseStudy = {
  overview:
    "Express REST API modeling a phone retail catalog with carts, checkout, inventory reservation, and order webhooks backed by MongoDB.",
  problem:
    "I needed a project that exercises **inventory concurrency**, **authenticated checkout**, and **outbound webhooks** similar to Stripe-style order notifications. The API had to demonstrate realistic e-commerce backend patterns without building a full storefront UI.",
  solution:
    "The API exposes product search, cart mutations, and checkout routes protected by **JWT**. Stock reservation middleware prevents overselling during concurrent checkouts. Order status changes emit **HMAC-signed webhook events** to registered callback URLs.",
  architecture: [
    {
      title: "API Routes",
      items: [
        "Express router modules for catalog, cart, auth, checkout, and webhooks",
        "Public product listing and search with pagination query params",
        "Authenticated cart add/update/remove and checkout confirmation endpoints",
        "Webhook registration and order event emission on status transitions",
      ],
    },
    {
      title: "Auth & Security",
      items: [
        "JWT access tokens with refresh token rotation for longer mobile sessions",
        "Password hashing and login/register routes with input validation",
        "express-rate-limit on public catalog routes and stricter limits on auth endpoints",
        "Role-scoped middleware separating customer actions from admin inventory updates",
      ],
    },
    {
      title: "Inventory & Data",
      items: [
        "MongoDB documents for products, variants, inventory counts, carts, and orders",
        "Atomic decrement operations during checkout to avoid overselling stock",
        "Stock reservation middleware holding inventory briefly during payment simulation",
        "Order documents tracking status pipeline: pending, confirmed, shipped, cancelled",
      ],
    },
  ],
  keyDecisions: [
    {
      title: "Atomic inventory decrements",
      description:
        "Two simultaneous checkouts for the last unit must not both succeed. MongoDB **findOneAndUpdate** with quantity guards ensures decrements happen atomically. Failed reservations return 409 responses so clients can refresh availability.",
    },
    {
      title: "Refresh tokens for session continuity",
      description:
        "Mobile shoppers expect to stay signed in. Short-lived access tokens limit exposure while **refresh tokens** let clients obtain new access tokens without forcing a full re-login on every request.",
    },
    {
      title: "Signed webhooks on order transitions",
      description:
        "Downstream systems (fulfillment, email) need to react when orders change state. Emitting **HMAC-signed POST requests** on transitions mirrors how payment providers notify merchants and gave me a realistic integration surface to test.",
    },
  ],
  metrics: [
    { value: "JWT", label: "Auth + refresh" },
    { value: "MongoDB", label: "Product catalog" },
    { value: "Webhooks", label: "Order events" },
  ],
  stack: [
    "TypeScript",
    "Node.js",
    "Express",
    "JavaScript",
    "MongoDB",
    "REST APIs",
    "JSON",
    "JWT",
    "Refresh tokens",
    "express-rate-limit",
    "HMAC webhooks",
    "Inventory reservation",
    "Cart API",
    "Checkout flows",
    "Password hashing",
    "Pagination",
    "Order status pipeline",
  ],
  screenshots: [{ src: "/case-studies/phone-store-cover.png", alt: "Phone Store API cover" }],
};
