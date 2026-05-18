import type { Metadata } from "next";
import db from "@/lib/db";
import DashboardClient from "./DashboardClient";
import { FiUsers, FiBook, FiMap, FiCalendar, FiHome } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
}
