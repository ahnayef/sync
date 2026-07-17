import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { parseEntityWorkbook, fetchAndParseEntitySheet, EntityType } from "@/lib/entity-importer";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "moderator"].includes((session.user as any)?.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const entityType = formData.get("entityType") as EntityType;
    const programId = formData.get("programId") ? Number(formData.get("programId")) : undefined;
    
    if (!["batch", "teacher", "course", "room"].includes(entityType)) {
      return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    const sheetLink = formData.get("sheetLink") as string | null;

    let rows;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      rows = await parseEntityWorkbook(buffer, file.name, entityType, programId);
    } else if (sheetLink) {
      rows = await fetchAndParseEntitySheet(sheetLink, entityType, programId);
    } else {
      return NextResponse.json({ error: "No file or Google Sheet link provided" }, { status: 400 });
    }

    return NextResponse.json({ rows });
  } catch (error: any) {
    console.error("Preview error:", error);
    return NextResponse.json({ error: error.message || "Failed to parse file." }, { status: 500 });
  }
}
