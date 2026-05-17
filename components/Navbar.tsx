"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogoIcon } from "./Icon";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,12,16,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" id="nav-logo" className="flex items-center gap-2 no-underline">
          <div className="flex h-8 w-8 items-center justify-center  text-base font-bold text-white">
            <LogoIcon />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Loop
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {publicLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={[
                  "rounded-lg px-3.5 py-2 text-sm font-medium no-underline transition-all duration-200",
                  isActive
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-white/50 hover:text-white/80",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2.5">
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-white/5" />
          ) : session ? (
            <Link
              href={(session.user as any)?.role === "admin" ? "/dashboard" : "/profile"}
              id="nav-profile"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white no-underline transition-all duration-200 hover:border-white/20 hover:bg-white/10"
            >
              {session.user?.image ? (
                <img src={session.user.image} alt="Avatar" className="h-5 w-5 rounded-full object-cover" />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#a371f7] text-[10px] font-bold text-white">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              Profile
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                id="nav-login"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/50 no-underline transition-all duration-200 hover:border-white/20 hover:text-white/80"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                id="nav-signup"
                className="rounded-lg bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-4 py-2 text-sm font-semibold text-white no-underline shadow-[0_0_20px_rgba(79,142,247,0.25)] transition-all duration-200 hover:shadow-[0_0_28px_rgba(79,142,247,0.4)]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
