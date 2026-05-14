import UserSidebar from "@/components/UserSidebar";

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg-base)" }}>
      <UserSidebar />
      <main style={{ flex: 1, overflowX: "hidden" }}>{children}</main>
    </div>
  );
}