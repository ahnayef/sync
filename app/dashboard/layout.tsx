import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg-base)" }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflowX: "hidden" }}>{children}</main>
    </div>
  );
}