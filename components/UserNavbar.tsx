"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogoIcon } from "./Icon";
import { useState } from "react";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

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
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,12,16,0.85)] backdrop-blur-xl">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        
        {/* Mobile Header Row (Visible only on mobile) */}
        <div className="flex items-center justify-between h-14 sm:hidden">
          <Link href="/" id="user-nav-logo" className="flex shrink-0 items-center gap-1.5 no-underline">
            <div className="flex h-6 w-6 items-center justify-center text-base font-bold text-white">
              <LogoIcon />
            </div>
            <span className="text-base font-bold tracking-tight text-white">Loop</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-95"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        {/* Desktop Header Row (Hidden on mobile) */}
        {/* 3-column grid keeps nav links perfectly centred on larger screens */}
        <div className="hidden h-16 grid-cols-[1fr_auto_1fr] items-center sm:grid">
          <Link href="/" id="user-nav-logo" className="flex shrink-0 items-center gap-2.5 no-underline">
            <div className="flex h-8 w-8 items-center justify-center text-base font-bold text-white">
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
              <p className="m-0 text-[11px] text-white/40">{role || "student"}</p>
            </div>

            <div className="h-7 w-px bg-white/10" />

            <button
              id="user-nav-logout"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-transparent px-3.5 py-[7px] text-[13px] font-medium text-white/50 transition-all duration-200 hover:border-white/20 hover:text-white/80"
            >
              <FiLogOut size={14} />
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="sm:hidden border-t border-white/10 bg-[rgba(8,12,16,0.95)] backdrop-blur-2xl animate-in slide-in-from-top duration-300 ease-out">
          <div className="flex flex-col gap-4 px-6 py-6">
            
            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    id={`mobile-user-nav-${item.label.toLowerCase()}`}
                    className={[
                      "rounded-lg px-4 py-2.5 text-base font-medium no-underline transition-all",
                      isActive
                        ? "bg-blue-500/10 text-blue-400 font-semibold"
                        : "text-white/60 hover:bg-white/5 hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="h-px bg-white/10 my-1" />

            {/* Mobile User Profile Section */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="h-10 w-10 shrink-0 rounded-full object-cover shadow-[0_0_12px_rgba(79,142,247,0.25)]" />
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
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 h-10 px-4 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
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
