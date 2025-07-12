import { EditAlbumForm } from "./form";
import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { notFound } from "next/navigation";

export default async function EditAlbumPage({ params }: { params: { albumId: string } }) {
  const session = await getServerAuthSession();

  const album = await prisma.memoryAlbum.findUnique({
    where: { id: params.albumId },
  });

  if (!album || album.userId !== session?.user.id) return notFound();

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ 编辑专辑</h1>
      <EditAlbumForm
        albumId={album.id}
        initialName={album.name}
        initialDescription={album.description ?? ""}
        initialVisibility={album.visibility}
      />
    </div>
  );
}
