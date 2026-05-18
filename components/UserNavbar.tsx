"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/routine", label: "Routine" },
  { href: "/courses", label: "Courses" },
  { href: "/profile", label: "Profile" },
];

export default function UserNavbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,12,16,0.85)] backdrop-blur-xl">
      {/* 3-column grid keeps nav links perfectly centred */}
      <div className="mx-auto grid h-16 max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center px-6">

        {/* Logo — col 1 */}
        <Link href="/" id="user-nav-logo" className="flex shrink-0 items-center gap-2.5 no-underline">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4f8ef7] to-[#a371f7] text-base font-bold text-white shadow-[0_0_20px_rgba(79,142,247,0.3)]">
            L
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Loop</span>
        </Link>

        {/* Nav links — col 2 (auto, true centre) */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`user-nav-${item.label.toLowerCase()}`}
                className={[
                  "rounded-lg border px-3.5 py-2 text-sm font-medium no-underline transition-all duration-200",
                  isActive
                    ? "border-blue-400/20 bg-blue-500/10 text-blue-400"
                    : "border-transparent text-white/50 hover:text-white/80",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User info + logout — col 3, pinned right */}
        <div className="flex items-center gap-3 justify-self-end">

          {/* Avatar */}
          <div className="flex h-[34px] w-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#a371f7] text-sm font-bold text-white shadow-[0_0_12px_rgba(79,142,247,0.25)]">
            J
          </div>

          {/* Name + Student ID */}
          <div className="leading-tight">
            <p className="m-0 text-[13px] font-semibold text-white">Jane Doe</p>
            <p className="m-0 text-[11px] text-white/40">STU-2024-001</p>
          </div>

          {/* Divider */}
          <div className="h-7 w-px bg-white/10" />

          {/* Logout */}
          <button
            id="user-nav-logout"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-transparent px-3.5 py-[7px] text-[13px] font-medium text-white/50 transition-all duration-200 hover:border-white/20 hover:text-white/80"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>

        </div>
      </div>
    </nav>
  );
}
