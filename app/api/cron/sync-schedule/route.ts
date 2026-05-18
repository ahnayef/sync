import { NextResponse } from "next/server";
import db from "@/lib/db";
import { syncDepartmentSchedule } from "@/lib/schedule-parser";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Allow authorization header validation if Vercel Cron secret is set
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
  }

  try {
    // Fetch all departments with sheet sync enabled
    const [departments]: any[] = await db.execute(
      "SELECT id, name, sheet_link FROM departments WHERE sync_enabled = true AND sheet_link IS NOT NULL"
    );

    const results = [];
    for (const dept of departments) {
      try {
        console.log(`⏳ Starting cron sync for department ${dept.name} (${dept.id})...`);
        const syncResult = await syncDepartmentSchedule(dept.id, dept.sheet_link);
        results.push({
          department: dept.name,
          status: "success",
          inserted: syncResult.inserted
        });
      } catch (err) {
        console.error(`❌ Cron sync failed for department ${dept.name}:`, err);
        results.push({
          department: dept.name,
          status: "error",
          error: err instanceof Error ? err.message : "Sync failed"
        });
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error) {
    console.error("Cron schedule sync fatal error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Fatal error during cron sync execution"
    }, { status: 500 });
  }
}
