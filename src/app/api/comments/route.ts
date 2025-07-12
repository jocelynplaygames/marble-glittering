import { prisma } from "~/server/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parentId = searchParams.get("parentId");

  if (!parentId) {
    return NextResponse.json([]);
  }

  const replies = await prisma.comment.findMany({
    where: { replyToId: parentId },
    include: {
      author: true,
      votes: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(replies);
}
