import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg-base)]">
      <AdminSidebar />
      <main className="w-full min-w-0 flex-1 overflow-x-hidden pt-16 md:pt-0">{children}</main>
    </div>
  );
}