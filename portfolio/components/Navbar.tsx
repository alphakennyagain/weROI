"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#cybersecurity", label: "Security" },
  { href: "#resources", label: "Resources" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10 bg-[#0a0e17]/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="font-serif text-lg tracking-tight text-white">
          {profile.name.split(" ")[0]}
          <span className="text-teal-400">.</span>
        </a>
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-teal-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={profile.contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1.5 text-sm text-teal-300 transition hover:bg-teal-500/20"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}
