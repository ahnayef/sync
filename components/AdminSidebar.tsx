"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/manage-department",
    label: "Departments",
    icon: (
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
    ),
  },
  {
    href: "/dashboard/manage-batch",
    label: "Batches",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/manage-teachers",
    label: "Teachers",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/manage-courses",
    label: "Courses",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/manage-rooms",
    label: "Rooms",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/manage-schedule",
    label: "Schedule",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[240px] min-h-screen flex-col overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-6">
      {/* Logo */}
      <Link
        href="/"
        id="admin-sidebar-logo"
        className="mb-6 flex items-center gap-2.5 px-3 py-2 no-underline"
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-accent-muted)] text-[16px] font-bold text-[var(--color-accent)] shadow-[0_0_18px_rgba(79,142,247,0.18)]">
          L
        </div>
        <div>
          <span className="block text-[17px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
            Loop
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">
            Admin
          </span>
        </div>
      </Link>

      {/* Nav Items */}
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        Management
      </p>
      <nav className="flex flex-col gap-1">
        {adminNavItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`admin-nav-${item.label.toLowerCase()}`}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium no-underline transition-all duration-200 ${
                isActive
                  ? "border-[rgba(79,142,247,0.2)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                  : "border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto flex flex-col gap-3 border-t border-[var(--color-border)] pt-6">
        {/* Admin badge */}
        <div className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-muted)] text-[13px] font-bold text-[var(--color-accent)]">
            A
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">
              Admin
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)]">admin@loop.edu</p>
          </div>
        </div>
        <button
          id="admin-logout"
          className="flex items-center gap-2 rounded-lg border border-[rgba(248,81,73,0.2)] bg-transparent px-3 py-2.5 text-left text-sm font-medium text-[var(--color-danger)] transition-all duration-200 hover:bg-[rgba(248,81,73,0.06)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}
