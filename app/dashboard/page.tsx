import type { Metadata } from "next";
import DashboardClient from "@/components/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | Sync",
  description: "Sync Schedule Management and Academic Analytics Dashboard",
};

export default function DashboardPage() {
  return <DashboardClient />;
}