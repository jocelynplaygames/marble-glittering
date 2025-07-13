//列出当前用户的所有专辑
// app/api/memory/list/route.ts
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const albums = await prisma.memoryAlbum.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = albums.map((album) => ({
    id: album.id,
    name: album.name,
    count: album._count.items,
    visibility: album.visibility.toLowerCase() as "private" | "public" | "friends",
  }));

  return NextResponse.json(result);
}
