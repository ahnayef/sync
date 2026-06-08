import { NextResponse } from "next/server";
import db from "@/lib/db";
import { syncDepartmentSchedule } from "@/lib/schedule-parser";

export const dynamic = "force-dynamic";

async function sendTelegramReport(message: string) {
  try {
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;
    if (!botToken || !chatId) {
      console.warn("Telegram BOT_TOKEN or CHAT_ID not configured; skipping report");
      return;
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    });
  } catch (err) {
    console.error("Failed to send telegram report:", err);
  }
}

function escapeHtml(input: string) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

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
          // Send human-readable error report to Telegram
          try {
            const time = new Date().toISOString();
            const errMsg = err instanceof Error ? err.message : String(err);
            const message = `
<b>Sync Cron — Department Error</b>
<b>Department:</b> ${escapeHtml(String(dept.name))} (${dept.id})
<b>Time:</b> ${time}
<b>Error:</b>
<pre>${escapeHtml(errMsg)}</pre>
`;
            await sendTelegramReport(message);
          } catch (notifyErr) {
            console.error("Failed to notify telegram about department error:", notifyErr);
          }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error) {
    console.error("Cron schedule sync fatal error:", error);
    // Send fatal error report to Telegram
    try {
      const time = new Date().toISOString();
      const errMsg = error instanceof Error ? error.message : String(error);
      const message = `
<b>Sync Cron — Fatal Error</b>
<b>Time:</b> ${time}
<b>Error:</b>
<pre>${escapeHtml(errMsg)}</pre>
`;
      await sendTelegramReport(message);
    } catch (notifyErr) {
      console.error("Failed to notify telegram about fatal error:", notifyErr);
    }

    return NextResponse.json({
      error: error instanceof Error ? error.message : "Fatal error during cron sync execution"
    }, { status: 500 });
  }
}
