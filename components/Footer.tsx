import Link from "next/link";
import { LogoIcon } from "@/components/Icon";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Branding */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex w-fit items-center gap-3 no-underline"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/5 p-2 shadow-[0_0_24px_rgba(79,142,247,0.2)] ring-1 ring-white/10">
                <LogoIcon />
              </div>
              <span className="text-base font-semibold text-[var(--color-text-primary)]">
                Sync
              </span>
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Smart scheduling for a better routine.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Navigation
            </p>
            <div className="flex flex-col gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--color-text-muted)] no-underline transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Info
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/contact"
                className="text-sm text-[var(--color-text-muted)] no-underline transition-colors hover:text-[var(--color-text-primary)]"
              >
                Get in touch
              </Link>
              <Link
                href="/about"
                className="text-sm text-[var(--color-text-muted)] no-underline transition-colors hover:text-[var(--color-text-primary)]"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-[var(--color-border)]" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[var(--color-text-muted)]">
            © 2026 Sync. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Made with care by{" "}
            <Link
              href="https://github.com/ahnayef"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] no-underline transition-colors hover:text-[#8ab2ff]"
            >
              AHN
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
