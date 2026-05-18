import type { Metadata } from "next";
import DashboardClient from "@/components/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | Loop",
  description: "Loop Schedule Management and Academic Analytics Dashboard",
};

export default function DashboardPage() {
  return <DashboardClient />;
}