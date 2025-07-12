// app/api/memory/delete/route.ts
export async function DELETE(req: Request) {
  const session = await getServerAuthSession();

  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await req.json();

  await prisma.memoryAlbum.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ success: true });
}
