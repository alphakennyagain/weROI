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
      title: "Network Traffic Analysis Lab",
      description: "Captured and analysed HTTP/TCP traffic with Wireshark; documented handshake flow and common attack vectors.",
      href: "#projects",
    },
    {
      title: "Secure API Hardening",
      description: "Applied input validation, rate limiting awareness, and JWT best practices on a FastAPI project.",
      href: "#projects",
    },
    {
      title: "OWASP Learning Path",
      description: "Working through PortSwigger Web Security Academy modules alongside coursework networking labs.",
      href: "https://portswigger.net/web-security",
    },
  ],
};
