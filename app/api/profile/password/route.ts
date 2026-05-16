import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT password_hash FROM users WHERE email = ?",
      [session.user.email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    // If user has a password, verify it
    if (user.password_hash) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required" }, { status: 400 });
      }
      const isValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValid) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
      }
    } else {
      // If user doesn't have a password (e.g. Google auth), they can just set one
      // Optionally we could require them to not have this feature, but setting one is fine.
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE users SET password_hash = ? WHERE email = ?",
      [hashed, session.user.email]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password err:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
