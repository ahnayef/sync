import { NextResponse } from "next/server";
import db from "@/lib/db";
import { syncProgramSchedule } from "@/lib/schedule-parser";

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

function formatTelegramErrorList(errorText: string) {
  const normalized = errorText
    .replace(/^Sync failed\.\s*/i, "")
    .replace(/^Found \d+ validation errors\. Top errors:\s*/i, "")
    .trim();

  const items = normalized
    .split(/\s*\|\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);

  if (items.length === 0) {
    return `<i>No validation details were available.</i>`;
  }

  return items
    .map((item, index) => `<b>${index + 1}.</b>\n<pre>${escapeHtml(item)}</pre>`)
    .join("\n\n");
}

export async function GET(req: Request) {
  // Allow authorization header validation if Vercel Cron secret is set
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
  }

  try {
    // Fetch all programs with sheet sync enabled
    const [programs]: any[] = await db.execute(
      "SELECT p.id, p.name, d.name as department_name, p.sheet_link FROM programs p JOIN departments d ON p.department_id = d.id WHERE p.sync_enabled = true AND p.sheet_link IS NOT NULL"
    );

    const results = [];
    for (const prog of programs) {
      const displayName = `${prog.department_name} - ${prog.name}`;
      try {
        console.log(`⏳ Starting cron sync for program ${displayName} (${prog.id})...`);
        const syncResult = await syncProgramSchedule(prog.id, prog.sheet_link);
        results.push({
          program: displayName,
          status: "success",
          inserted: syncResult.inserted
        });
      } catch (err) {
        console.error(`❌ Cron sync failed for program ${displayName}:`, err);
        results.push({
          program: displayName,
          status: "error",
          error: err instanceof Error ? err.message : "Sync failed"
        });
          // Send human-readable error report to Telegram
          try {
            const time = new Date().toISOString();
            const errMsg = err instanceof Error ? err.message : String(err);
            const readableError = formatTelegramErrorList(errMsg);
            const message = `<b>Sync Cron — Program Error</b>\n<b>Program:</b> ${escapeHtml(String(displayName))} (${prog.id})\n<b>Time:</b> ${time}\n<b>Validation issues:</b>\n${readableError}`;
            await sendTelegramReport(message);
          } catch (notifyErr) {
            console.error("Failed to notify telegram about program error:", notifyErr);
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
      const readableError = formatTelegramErrorList(errMsg);
      const message = `<b>Sync Cron — Fatal Error</b>\n<b>Time:</b> ${time}\n<b>Details:</b>\n${readableError}`;
      await sendTelegramReport(message);
    } catch (notifyErr) {
      console.error("Failed to notify telegram about fatal error:", notifyErr);
    }

    return NextResponse.json({
      error: error instanceof Error ? error.message : "Fatal error during cron sync execution"
    }, { status: 500 });
  }
}
