import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";

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
    const [rows] = await db.execute(`
      SELECT c.id, c.name, c.code, c.is_lab as isLab, d.name as dept, c.department_id
      FROM courses c
      LEFT JOIN departments d ON c.department_id = d.id
      ORDER BY c.code ASC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch courses err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, code, isLab, departmentId } = await req.json();
    if (!code || !departmentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [result]: any = await db.execute(
      "INSERT INTO courses (name, code, is_lab, department_id) VALUES (?, ?, ?, ?)",
      [name, code.toUpperCase(), isLab ? 1 : 0, departmentId]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "Course code already exists" }, { status: 400 });
    }
    console.error("Add course err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, name, code, isLab, departmentId } = await req.json();
    if (!id || !code || !departmentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.execute(
      "UPDATE courses SET name = ?, code = ?, is_lab = ?, department_id = ? WHERE id = ?",
      [name, code.toUpperCase(), isLab ? 1 : 0, departmentId, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "Course code already exists" }, { status: 400 });
    }
    console.error("Update course err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.execute("DELETE FROM courses WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete course err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
