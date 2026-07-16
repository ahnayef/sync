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
      SELECT b.id, b.name, b.session, p.name as program_name, d.name as dept, b.program_id
      FROM batches b
      JOIN programs p ON b.program_id = p.id
      JOIN departments d ON p.department_id = d.id
      ORDER BY b.name ASC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch batches err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, session, programId } = await req.json();
    if (!name || !session || !programId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [result]: any = await db.execute(
      "INSERT INTO batches (name, session, program_id) VALUES (?, ?, ?)",
      [name, session, programId]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "Batch already exists for this session/program" }, { status: 400 });
    }
    console.error("Add batch err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, name, session, programId } = await req.json();
    if (!id || !name || !session || !programId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.execute(
      "UPDATE batches SET name = ?, session = ?, program_id = ? WHERE id = ?",
      [name, session, programId, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "Batch already exists for this session/program" }, { status: 400 });
    }
    console.error("Update batch err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.execute("DELETE FROM batches WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete batch err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
