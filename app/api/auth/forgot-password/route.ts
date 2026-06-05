import { NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";
import crypto from "crypto";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const [rows] = await db.execute<RowDataPacket[]>("SELECT id, email FROM users WHERE email = ?", [email]);
    if (!rows || rows.length === 0) {
      // Don't reveal whether the email exists
      return NextResponse.json({ success: true });
    }

    const user = rows[0];
    const code = String(100000 + Math.floor(Math.random() * 900000)); // 6-digit
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    await db.execute(
      "INSERT INTO password_resets (user_id, code_hash, expires_at, used) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR), 0)",
      [user.id, codeHash]
    );

    // Send email with the code
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const subject = "Reset your Sync password";
    const text = `Your Sync password reset code is: ${code}\n\nThis code will expire in 1 hour.`;
    const html = `<p>Your Sync password reset code is:</p><h2>${code}</h2><p>This code will expire in 1 hour.</p><p>If you didn't request this, ignore this email.</p>`;

    await sendMail({ receiver: user.email, subject, text, html });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("forgot-password err:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
