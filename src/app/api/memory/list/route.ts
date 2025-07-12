//列出当前用户的所有专辑
// app/api/memory/list/route.ts
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerAuthSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const albums = await prisma.memoryAlbum.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });

  return NextResponse.json(albums);
}
