"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogoIcon } from "./Icon";
import { useState } from "react";
import { FiArrowRight, FiMenu, FiX, FiLogOut } from "react-icons/fi";

export default function UserNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
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
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,12,16,0.72)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[rgba(8,12,16,0.62)]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">

        {/* Mobile Header Row (Visible only on mobile) */}
        <div className="flex h-14 items-center justify-between sm:hidden">
          <Link
            href="/"
            id="user-nav-logo"
            className="flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 no-underline transition-colors hover:border-white/15 hover:bg-white/[0.05]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(79,142,247,0.22),rgba(163,113,247,0.2))] text-base font-bold text-white shadow-[0_10px_30px_rgba(79,142,247,0.14)]">
              <LogoIcon />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-semibold tracking-[0.02em] text-white">Sync</span>
              <span className="block text-[11px] text-white/45">Smart schedules</span>
            </div>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:border-white/15 hover:bg-white/[0.08] hover:text-white active:scale-95"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        {/* Desktop Header Row (Hidden on mobile) */}
        {/* 3-column grid keeps nav links perfectly centred on larger screens */}
        <div className="hidden h-16 grid-cols-[1fr_auto_1fr] items-center sm:grid">
          <Link
            href="/"
            id="nav-logo"
            className="flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 no-underline transition-colors hover:border-white/15 hover:bg-white/[0.05] w-fit"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(79,142,247,0.22),rgba(163,113,247,0.2))] text-base font-bold text-white shadow-[0_10px_30px_rgba(79,142,247,0.14)]">
              <LogoIcon />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-semibold tracking-[0.02em] text-white sm:text-base">
                Sync
              </span>
              <span className="block text-[11px] text-white/45">
                Smart schedules
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  id={`user-nav-${item.label.toLowerCase()}`}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium no-underline transition-all duration-200",
                    isActive
                      ? "bg-[rgba(79,142,247,0.14)] text-[#9fc0ff] shadow-[inset_0_0_0_1px_rgba(79,142,247,0.18)]"
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white/90",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 justify-self-end">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Avatar" className="h-[34px] w-[34px] shrink-0 rounded-full object-cover ring-1 ring-white/10" />
              ) : (
                <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#a371f7] text-sm font-bold text-white shadow-[0_0_12px_rgba(79,142,247,0.25)]">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              <div className="leading-tight">
                <p className="m-0 text-[13px] font-semibold text-white">{session?.user?.name || "User"}</p>
                <p className="m-0 text-[11px] text-white/40">{role || "student"}</p>
              </div>
            </div>

            <button
              id="user-nav-logout"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-[13px] font-medium text-white/55 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] hover:text-white/85"
            >
              <FiLogOut size={14} />
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="border-t border-white/10 bg-[rgba(8,12,16,0.96)] shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:hidden animate-in slide-in-from-top duration-300 ease-out">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-5 sm:px-6">

            {/* Mobile Nav Links */}
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    id={`mobile-user-nav-${item.label.toLowerCase()}`}
                    className={[
                      "block rounded-[14px] px-4 py-3 text-base font-medium no-underline transition-all",
                      isActive
                        ? "bg-[rgba(79,142,247,0.14)] text-[#9fc0ff]"
                        : "text-white/65 hover:bg-white/[0.05] hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="h-px bg-white/10" />

            {/* Mobile User Profile Section */}
            <div className="flex flex-col gap-3 rounded-[20px] border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/10" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#a371f7] text-base font-bold text-white shadow-[0_0_12px_rgba(79,142,247,0.25)]">
                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}

                <div className="leading-tight">
                  <p className="m-0 text-sm font-semibold text-white">{session?.user?.name || "User"}</p>
                  <p className="m-0 text-xs text-white/40">{role || "student"}</p>
                </div>
              </div>

              <button
                id="mobile-user-nav-logout"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                <FiLogOut size={14} />
                Log out
              </button>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
