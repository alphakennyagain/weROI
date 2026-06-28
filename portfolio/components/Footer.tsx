import { profile } from "@/content/profile";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} {profile.name}. Personal portfolio — separate from{" "}
          <a href="https://weroi.net" className="text-zinc-400 transition hover:text-teal-400">
            weROI
          </a>
          .
        </p>
        <p className="text-xs text-zinc-600">Built with Next.js · TypeScript · Tailwind CSS</p>
      </div>
    </footer>
  );
}
