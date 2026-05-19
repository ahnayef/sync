"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { LogoIcon } from "./Icon";

const adminNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  )},
  { href: "/dashboard/manage-department", label: "Departments", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  )},
  { href: "/dashboard/manage-batch", label: "Batches", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )},
  { href: "/dashboard/manage-teachers", label: "Teachers", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )},
  { href: "/dashboard/manage-courses", label: "Courses", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )},
  { href: "/dashboard/manage-rooms", label: "Rooms", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { href: "/dashboard/manage-schedule", label: "Schedule", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )},
  { href: "/dashboard/manage-moderators", label: "Moderators", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )},
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        id="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center h-10 w-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors"
        aria-label="Toggle menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 flex h-screen w-[240px] min-h-screen flex-col overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-6 transition-transform md:transition-none md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <Link href="/" id="admin-sidebar-logo" className="mb-6 flex items-center gap-2.5 px-3 py-2 no-underline">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-accent-muted)] shadow-[0_0_18px_rgba(79,142,247,0.18)]">
            <LogoIcon className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-[17px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">Loop</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">Admin</span>
          </div>
        </Link>

        {/* Nav Items */}
        <p className="mb-2 px-3 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Management</p>
        <nav className="flex flex-col gap-1">
          {adminNavItems.map((item) => {
            // Hide moderators tab if the user is just a moderator (only admins can manage mods)
            if (item.href === "/dashboard/manage-moderators" && (session?.user as any)?.role !== "admin") {
              return null;
            }

            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`admin-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                onClick={() => setIsOpen(false)}
                title={item.label}
                className={`flex items-center gap-2.5 rounded-lg border px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium no-underline transition-all duration-200 ${
                  isActive
                    ? "border-[rgba(79,142,247,0.2)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                    : "border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {item.icon}
                <span className="inline ml-2">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-2 sm:gap-3 border-t border-[var(--color-border)] pt-4 sm:pt-6">
          {/* Admin badge (visible on mobile and up) */}
          <div className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2.5">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Avatar" className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-muted)] text-[11px] sm:text-[13px] font-bold text-[var(--color-accent)]">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-[13px] font-semibold text-[var(--color-text-primary)] truncate">{session?.user?.name || "Admin"}</p>
              <p className="text-[9px] sm:text-[11px] text-[var(--color-text-muted)] truncate">{session?.user?.email || "admin@loop.edu"}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:gap-1.5">
            <Link
              href="/profile"
              id="admin-profile-link"
              className="flex items-center justify-center sm:justify-start gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-[var(--color-text-primary)] no-underline transition-all duration-200 hover:bg-[var(--color-bg-surface)] hover:border-[rgba(79,142,247,0.3)] shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent)]">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span className="inline ml-2">Profile Settings</span>
            </Link>
            <button
              id="admin-logout"
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center justify-center sm:justify-start gap-2 rounded-lg border border-[rgba(248,81,73,0.2)] bg-transparent px-2 sm:px-3 py-2 sm:py-2.5 text-left text-xs sm:text-sm font-medium text-[var(--color-danger)] transition-all duration-200 hover:bg-[rgba(248,81,73,0.06)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="inline ml-2">Log out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
