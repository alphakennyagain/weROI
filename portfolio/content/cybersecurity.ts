export const cybersecurity = {
  narrative:
    "Security isn't a separate hobby — it's how I think about every layer I touch. From validating inputs on an API to understanding how packets move across a network, I build with the assumption that someone will try to break it.",
  learningFocus: [
    "Secure SDLC and threat modeling basics",
    "Web application security (OWASP Top 10)",
    "Networking fundamentals and packet analysis",
    "Authentication and session management patterns",
    "Linux hardening and CLI workflows",
  ],
  tools: [
    { name: "Kali Linux VM", description: "Lab environment for security exercises" },
    { name: "Wireshark", description: "Packet capture and protocol analysis" },
    { name: "Burp Suite Community", description: "Web proxy for request inspection" },
    { name: "Nmap", description: "Network discovery and port scanning basics" },
    { name: "GitHub Security Advisories", description: "Dependency vulnerability tracking" },
  ],
  projects: [
    {
      title: "Secure Auth Starter",
      description: "JWT, bcrypt, rate limiting, and OWASP-aligned session handling patterns.",
      href: "https://github.com/zacharyahutton",
    },
    {
      title: "Network Lab Notes",
      description: "Subnetting, firewall rules, and Wireshark capture analysis in a homelab VM.",
      href: "https://github.com/zacharyahutton",
    },
    {
      title: "PortSwigger Web Security Academy",
      description: "Working through web security modules alongside UTech networking coursework.",
      href: "https://portswigger.net/web-security",
    },
  ],
};
