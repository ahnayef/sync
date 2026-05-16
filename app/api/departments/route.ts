import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Middleware checks if user is admin/mod
const checkAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "moderator"].includes((session.user as any)?.role)) {
    return false;
  }
  return true;
};

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [rows] = await db.execute("SELECT id, name, full_name as fullName FROM departments ORDER BY name ASC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch departments err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, fullName } = await req.json();
    if (!name || !fullName) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const [result]: any = await db.execute(
      "INSERT INTO departments (name, full_name) VALUES (?, ?)",
      [name.toUpperCase(), fullName]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "Department already exists" }, { status: 400 });
    }
    console.error("Add department err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, name, fullName } = await req.json();
    if (!id || !name || !fullName) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    await db.execute(
      "UPDATE departments SET name = ?, full_name = ? WHERE id = ?",
      [name.toUpperCase(), fullName, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "Department name or full name already exists" }, { status: 400 });
    }
    console.error("Update department err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.execute("DELETE FROM departments WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete department err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
