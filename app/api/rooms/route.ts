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
      SELECT id, number, building_name as buildingName, floor_number as floorNumber, title, room_type as roomType, capacity
      FROM rooms
      ORDER BY number ASC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch rooms err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { number, buildingName, floorNumber, title, roomType, capacity } = await req.json();
    if (!number || !buildingName || !floorNumber || !roomType || !capacity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [result]: any = await db.execute(
      "INSERT INTO rooms (number, building_name, floor_number, title, room_type, capacity) VALUES (?, ?, ?, ?, ?, ?)",
      [number, buildingName, floorNumber, title || null, roomType, capacity]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "Room number already exists" }, { status: 400 });
    }
    console.error("Add room err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, number, buildingName, floorNumber, title, roomType, capacity } = await req.json();
    if (!id || !number || !buildingName || !floorNumber || !roomType || !capacity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.execute(
      "UPDATE rooms SET number = ?, building_name = ?, floor_number = ?, title = ?, room_type = ?, capacity = ? WHERE id = ?",
      [number, buildingName, floorNumber, title || null, roomType, capacity, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "Room number already exists" }, { status: 400 });
    }
    console.error("Update room err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.execute("DELETE FROM rooms WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete room err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
