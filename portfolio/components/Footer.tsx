import { profile } from "@/content/profile";

const SOURCE_REPO = "https://github.com/zacharyahutton/weROI/tree/main/portfolio";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-slate)] px-6 py-10">
      <div className="mx-auto flex max-w-[var(--page-max-width)] flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-xs text-[var(--color-stone)]">
          © {new Date().getFullYear()} {profile.name} · personal portfolio
        </p>
        <p className="text-center text-[10px] text-[var(--color-stone)] sm:text-right">
          Built with Next.js, TypeScript, and Tailwind CSS ·{" "}
          <a href="/OPEN_SOURCE.md" className="underline underline-offset-2 hover:text-[var(--color-pearl)]">
            View source
          </a>
          {" · "}
          <a
            href={SOURCE_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--color-pearl)]"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
