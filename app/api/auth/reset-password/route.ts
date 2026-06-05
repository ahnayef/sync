import { NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();
    if (!email || !code || !newPassword) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    if (newPassword.length < 6) return NextResponse.json({ error: "Password too short" }, { status: 400 });

    const [users] = await db.execute<RowDataPacket[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (!users || users.length === 0) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const userId = users[0].id;

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT id, code_hash, expires_at, used FROM password_resets WHERE user_id = ? AND used = 0 ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    if (!rows || rows.length === 0) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    const reset = rows[0];
    if (new Date(reset.expires_at) < new Date()) return NextResponse.json({ error: "Expired code" }, { status: 400 });

    const codeHash = crypto.createHash("sha256").update(String(code)).digest("hex");
    if (codeHash !== reset.code_hash) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password_hash = ? WHERE id = ?", [hashed, userId]);

    // Mark reset as used
    await db.execute("UPDATE password_resets SET used = 1 WHERE id = ?", [reset.id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("reset-password err:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
