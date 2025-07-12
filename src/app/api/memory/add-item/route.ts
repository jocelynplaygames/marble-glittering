// app/api/memory/add-item/route.ts
import { NextRequest } from "next/server";
import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { albumId, postId, note } = body;

  if (!albumId || !postId) {
    return new Response("Missing fields", { status: 400 });
  }

  try {
    await prisma.memoryAlbumItem.create({
      data: {
        albumId,
        postId,
        note,
      },
    });
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("添加收藏失败", error);
    return new Response("Internal error", { status: 500 });
  }
}
