import { NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ error: "Email and code are required" }, { status: 400 });

    const [users] = await db.execute<RowDataPacket[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (!users || users.length === 0) return NextResponse.json({ error: "Invalid code or email" }, { status: 400 });
    const userId = users[0].id;

    const codeHash = crypto.createHash("sha256").update(String(code)).digest("hex");

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT id FROM password_resets WHERE user_id = ? AND code_hash = ? AND used = 0 AND expires_at > UTC_TIMESTAMP() ORDER BY created_at DESC LIMIT 1",
      [userId, codeHash]
    );

    if (!rows || rows.length === 0) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });

    // Valid code — do not mark used here; allow reset endpoint to finalize
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("verify-otp err:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
