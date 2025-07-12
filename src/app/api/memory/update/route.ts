// app/api/memory/update/route.ts
import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export async function PATCH(req: Request) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, name, description, visibility } = body;

  if (!id || !name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const updated = await prisma.memoryAlbum.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        name,
        description,
        visibility, // ✅ 支持更新 visibility
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update album error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
