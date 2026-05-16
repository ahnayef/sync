import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, studentId } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Check if new email is already taken by another user
    if (email !== session.user.email) {
      const [existingEmail] = await db.execute<RowDataPacket[]>(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
      if (existingEmail.length > 0) {
        return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
      }
    }

    // Update user info
    await db.execute(
      "UPDATE users SET name = ?, email = ?, student_id = ? WHERE email = ?",
      [name, email, studentId || null, session.user.email]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update profile err:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.execute("DELETE FROM users WHERE email = ?", [session.user.email]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete profile err:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
