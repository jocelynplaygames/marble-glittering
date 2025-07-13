// app/api/memory/add-item/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { albumId, postId, note } = body;

    if (!albumId || !postId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 可选：检查是否已存在，避免重复收藏
    const exists = await prisma.memoryAlbumItem.findFirst({
      where: {
        albumId,
        postId,
      },
    });

    if (exists) {
      return NextResponse.json({ message: "Already added" }, { status: 200 });
    }

    const newItem = await prisma.memoryAlbumItem.create({
      data: {
        albumId,
        postId,
        note: note || null,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("添加收藏失败:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
