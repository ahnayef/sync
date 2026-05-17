"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogoIcon } from "./Icon";



export default function UserNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  const navItems = [
    ...(role === "admin" || role === "moderator" ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    ...(role !== "admin" && role !== "moderator" ? [
      { href: "/routine", label: "Routine" },
      { href: "/courses", label: "Courses" },
    ] : []),
    { href: "/profile", label: "Profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,12,16,0.85)] backdrop-blur-xl">
      <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3 sm:hidden">
          <Link href="/" id="user-nav-logo" className="flex shrink-0 items-center gap-2 no-underline">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white">
              <LogoIcon />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Loop</span>
          </Link>

          <button
            id="user-nav-logout"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
            aria-label="Log out"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`user-nav-${item.label.toLowerCase()}`}
                className={[
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium no-underline transition-all duration-200",
                  isActive
                    ? "border-blue-400/20 bg-blue-500/10 text-blue-300"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/[0.06] hover:text-white/90",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* 3-column grid keeps nav links perfectly centred on larger screens */}
        <div className="hidden h-16 grid-cols-[1fr_auto_1fr] items-center sm:grid">
          <Link href="/" id="user-nav-logo" className="flex shrink-0 items-center gap-2.5 no-underline">
            <div className="flex h-8 w-8 items-center justify-center  text-base font-bold text-white">
              <LogoIcon />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Loop
            </span>
          </Link>

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
                      ? "border-blue-400/20 bg-blue-500/10 text-blue-300"
                      : "border-transparent text-white/50 hover:text-white/90",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 justify-self-end">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Avatar" className="h-[34px] w-[34px] shrink-0 rounded-full object-cover shadow-[0_0_12px_rgba(79,142,247,0.25)]" />
            ) : (
              <div className="flex h-[34px] w-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#a371f7] text-sm font-bold text-white shadow-[0_0_12px_rgba(79,142,247,0.25)]">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}

            <div className="leading-tight">
              <p className="m-0 text-[13px] font-semibold text-white">{session?.user?.name || "User"}</p>
              <p className="m-0 text-[11px] text-white/40">{(session?.user as any)?.role || "student"}</p>
            </div>

            <div className="h-7 w-px bg-white/10" />

            <button
              id="user-nav-logout"
              onClick={() => signOut({ callbackUrl: "/" })}
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
      </div>
    </nav >
  );
}
