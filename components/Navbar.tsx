"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogoIcon } from "./Icon";
import { useState } from "react";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import NavbarInstallButton from "./NavbarInstallButton";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,12,16,0.72)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[rgba(8,12,16,0.62)]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link
          href="/"
          id="nav-logo"
          className="group flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 no-underline transition-colors hover:border-white/15 hover:bg-white/[0.05]"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(79,142,247,0.22),rgba(163,113,247,0.2))] text-base font-bold text-white shadow-[0_10px_30px_rgba(79,142,247,0.14)]">
            <LogoIcon />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-semibold tracking-[0.02em] text-white sm:text-base">
              Sync
            </span>
            <span className="block text-[11px] text-white/45 transition-colors group-hover:text-white/55">
              Smart schedules
            </span>
          </div>
        </Link>

        {/* Nav Links (Desktop) */}
        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 md:flex">
          {publicLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium no-underline transition-all duration-200",
                  isActive
                    ? "bg-[rgba(79,142,247,0.14)] text-[#9fc0ff] shadow-[inset_0_0_0_1px_rgba(79,142,247,0.18)]"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/80",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <NavbarInstallButton />
          
          {status === "loading" ? (
            <div className="h-9 w-28 animate-pulse rounded-full bg-white/5" />
          ) : session ? (
            <Link
              href={(session.user as any)?.role === "admin" ? "/dashboard" : "/profile"}
              id="nav-profile"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-white no-underline transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07]"
            >
              {session.user?.image ? (
                <img src={session.user.image} alt="Avatar" className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10" />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#a371f7] text-[10px] font-bold text-white shadow-[0_8px_18px_rgba(79,142,247,0.24)]">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <span>Profile</span>
              <FiArrowRight className="text-white/35 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white/60" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                id="nav-login"
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/55 no-underline transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] hover:text-white/80"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                id="nav-signup"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-4 py-2 text-sm font-semibold text-white no-underline shadow-[0_0_20px_rgba(79,142,247,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(79,142,247,0.4)]"
              >
                Sign up
                <FiArrowRight className="text-white/85" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:border-white/15 hover:bg-white/[0.08] hover:text-white active:scale-95"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer/Menu Dropdown */}
      {isOpen && (
        <div className="border-t border-white/10 bg-[rgba(8,12,16,0.96)] shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:hidden animate-in slide-in-from-top duration-300 ease-out">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-5 sm:px-6">
            {/* Navigation Links */}
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-2">
              {publicLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    id={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={[
                      "block rounded-[14px] px-4 py-3 text-base font-medium no-underline transition-all",
                      isActive
                        ? "bg-[rgba(79,142,247,0.14)] text-[#9fc0ff]"
                        : "text-white/65 hover:bg-white/[0.05] hover:text-white",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="h-px bg-white/10" />

            {/* Auth Buttons */}
            <div className="flex flex-col gap-2.5">
              {status === "loading" ? (
                <div className="h-11 w-full animate-pulse rounded-[14px] bg-white/5" />
              ) : session ? (
                <Link
                  href={(session.user as any)?.role === "admin" ? "/dashboard" : "/profile"}
                  onClick={() => setIsOpen(false)}
                  id="mobile-nav-profile"
                  className="flex items-center justify-between gap-3 rounded-[16px] border border-white/10 bg-white/[0.04] px-4 py-3 text-base font-medium text-white no-underline transition-all hover:border-white/15 hover:bg-white/[0.08]"
                >
                  <div className="flex items-center gap-3">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Avatar" className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10" />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#a371f7] text-[11px] font-bold text-white">
                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span>Profile</span>
                  </div>
                  <FiArrowRight className="text-white/35" />
                </Link>
              ) : (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    id="mobile-nav-login"
                    className="flex items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.03] py-3 text-base font-medium text-white/65 no-underline transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    id="mobile-nav-signup"
                    className="flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] py-3 text-base font-semibold text-white no-underline shadow-[0_18px_40px_rgba(79,142,247,0.24)] transition-all hover:-translate-y-0.5"
                  >
                    Sign up
                    <FiArrowRight />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
