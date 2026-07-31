import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("department_id");

    let query = `
      SELECT p.id, p.department_id, p.name, p.sheet_link, p.sync_enabled, p.last_sync_at,
             d.name as department_name,
             d.full_name as department_full_name
      FROM programs p
      JOIN departments d ON p.department_id = d.id
    `;
    const params: any[] = [];

    if (departmentId) {
      query += " WHERE p.department_id = ?";
      params.push(Number(departmentId));
    }

    query += " ORDER BY d.name ASC, p.name ASC";

    const [rows] = await db.execute<RowDataPacket[]>(query, params);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Failed to fetch programs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, department_id } = body;

    if (!name || !department_id) {
      return NextResponse.json({ error: "Name and department_id are required" }, { status: 400 });
    }

    const [result]: any = await db.execute(
      "INSERT INTO programs (name, department_id) VALUES (?, ?)",
      [name, department_id]
    );

    return NextResponse.json({ id: result.insertId, name, department_id }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create program:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "A program with this name already exists in this department." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, department_id } = body;

    if (!id || !name || !department_id) {
      return NextResponse.json({ error: "id, name and department_id are required" }, { status: 400 });
    }

    await db.execute(
      "UPDATE programs SET name = ?, department_id = ? WHERE id = ?",
      [name, department_id, id]
    );

    return NextResponse.json({ id, name, department_id });
  } catch (error: any) {
    console.error("Failed to update program:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "A program with this name already exists in this department." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await db.execute("DELETE FROM programs WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete program:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
