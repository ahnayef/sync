"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { LogoIcon } from "./Icon";

const adminNavItems = [
  {
    href: "/dashboard", label: "Dashboard", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    )
  },
  {
    href: "/dashboard/manage-department", label: "Departments", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M12 6h.01" />
        <path d="M12 10h.01" />
        <path d="M12 14h.01" />
        <path d="M16 10h.01" />
        <path d="M16 14h.01" />
        <path d="M8 10h.01" />
        <path d="M8 14h.01" />
      </svg>
    )
  },
  {
    href: "/dashboard/manage-programs", label: "Programs", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    )
  },
  {
    href: "/dashboard/manage-batch", label: "Batches", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    href: "/dashboard/manage-teachers", label: "Teachers", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  },
  {
    href: "/dashboard/manage-courses", label: "Courses", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    )
  },
  {
    href: "/dashboard/manage-rooms", label: "Rooms", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    href: "/dashboard/manage-schedule", label: "Schedule", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    )
  },
  {
    href: "/dashboard/schedule-export", label: "Export Schedule", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    )
  },
  {
    href: "/dashboard/manage-moderators", label: "Moderators", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Persistent collapse state on desktop
  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("admin-sidebar-collapsed", String(next));
  };

  // Lock background scrolling on mobile when sidebar is open
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  return (
    <>
      {/* Mobile Top Header Bar (Fixed) */}
      <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[rgba(17,23,32,0.85)] px-4 backdrop-blur-md md:hidden">
        {/* Hamburger toggle button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-all active:scale-95 cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Center: Logo & Brand Name */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">

          <div className="text-left">
            <span className="block text-[15px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)] leading-tight">Sync</span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)] leading-none">Admin</span>
          </div>
        </Link>

        {/* Right: Quick avatar */}
        <div className="flex items-center gap-2">
          {session?.user?.image ? (
            <img src={session.user.image} alt="Avatar" className="h-8 w-8 rounded-full object-cover border border-[var(--color-border)]" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent-muted)] text-[11px] font-bold text-[var(--color-accent)] border border-[var(--color-border)]">
              {session?.user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 flex h-[100dvh] flex-col overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-bg-surface)] py-6 transition-all duration-300 ease-in-out md:translate-x-0 ${isCollapsed ? "md:w-[78px] md:px-3" : "md:w-[260px] md:px-4"
          } ${isOpen ? "translate-x-0 w-[260px] px-4" : "-translate-x-full md:translate-x-0 w-[260px]"
          }`}
      >
        {/* Sidebar Header with Logo and Close/Collapse Buttons */}
        <div className={`mb-6 flex ${isCollapsed ? "md:flex-col md:gap-3 md:items-center" : "items-center justify-between"} px-1 py-2`}>
          <Link href="/" id="admin-sidebar-logo" className="flex items-center gap-2.5 no-underline">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-accent-muted)] shadow-[0_0_18px_rgba(79,142,247,0.18)]">
              <LogoIcon className="h-6 w-6" />
            </div>
            <div className={`transition-all duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
              <span className="block text-[17px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">Sync</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">Admin</span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-all active:scale-95 cursor-pointer"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Desktop collapse/expand button (hidden on mobile) */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-all active:scale-95 cursor-pointer shadow-sm"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
                <line x1="3" y1="12" x2="15" y2="12" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            )}
          </button>
        </div>

        {/* Nav Items */}
        <p className={`mb-2 px-3 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)] transition-all duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
          Management
        </p>
        {isCollapsed && <div className="hidden md:block my-2 border-t border-[var(--color-border)] mx-2" />}

        <nav className="flex flex-col gap-1">
          {adminNavItems.map((item) => {
            // Hide moderators tab if the user is just a moderator (only admins can manage mods)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                className={`flex items-center gap-2.5 rounded-lg border py-2 sm:py-2.5 text-xs sm:text-sm font-medium no-underline transition-all duration-200 ${isCollapsed ? "md:justify-center md:px-0" : "px-2 sm:px-3"
                  } ${isActive
                    ? "border-[rgba(79,142,247,0.2)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                    : "border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                  }`}
              >
                {item.icon}
                <span className={`inline ml-2 transition-all duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-2 sm:gap-3 border-t border-[var(--color-border)] pt-4 sm:pt-6 mt-auto">
          {/* Admin badge */}
          <div className={`flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-subtle)] transition-all ${isCollapsed ? "md:justify-center md:p-1.5" : "px-3 py-2.5"
            }`}>
            {session?.user?.image ? (
              <img src={session.user.image} alt="Avatar" className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-muted)] text-[11px] sm:text-[13px] font-bold text-[var(--color-accent)]">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </div>
            )}
            <div className={`flex-1 min-w-0 transition-all duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
              <p className="text-[11px] sm:text-[13px] font-semibold text-[var(--color-text-primary)] truncate">{session?.user?.name || "Admin"}</p>
              <p className="text-[9px] sm:text-[11px] text-[var(--color-text-muted)] truncate">{session?.user?.email || "admin@loop.edu"}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:gap-1.5">
            <Link
              href="/profile"
              id="admin-profile-link"
              className={`flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-[var(--color-text-primary)] no-underline transition-all duration-200 hover:bg-[var(--color-bg-surface)] hover:border-[rgba(79,142,247,0.3)] shadow-sm ${isCollapsed ? "md:justify-center md:px-0" : "px-2 sm:px-3 justify-center sm:justify-start"
                }`}
              onClick={() => setIsOpen(false)}
              title="Profile Settings"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent)]">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className={`inline ml-2 transition-all duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>Profile Settings</span>
            </Link>
            <button
              id="admin-logout"
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className={`flex items-center gap-2 rounded-lg border border-[rgba(248,81,73,0.2)] bg-transparent py-2 sm:py-2.5 text-left text-xs sm:text-sm font-medium text-[var(--color-danger)] transition-all duration-200 hover:bg-[rgba(248,81,73,0.06)] cursor-pointer ${isCollapsed ? "md:justify-center md:px-0" : "px-2 sm:px-3 justify-center sm:justify-start"
                }`}
              title="Log out"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className={`inline ml-2 transition-all duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>Log out</span>
            </button>


          </div>
        </div>
      </aside>
    </>
  );
}
