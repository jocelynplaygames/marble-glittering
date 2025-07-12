//pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers

import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { albumId, newOrder } = await req.json();

  // 可选：校验权限

  await Promise.all(
    newOrder.map(({ id, order }: { id: string; order: number }) =>
      prisma.memoryAlbumItem.update({
        where: { id },
        data: { order },
      })
    )
  );

  return NextResponse.json({ success: true });
}
