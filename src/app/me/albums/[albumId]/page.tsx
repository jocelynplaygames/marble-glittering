import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { notFound, revalidatePath } from "next/navigation";
import { SortableAlbumItemList } from "~/components/SortableAlbumItemList"; // ✅ 路径请按实际调整

export default async function AlbumDetailPage({ params }: { params: { albumId: string } }) {
  const session = await getServerAuthSession();

  const album = await prisma.memoryAlbum.findUnique({
    where: { id: params.albumId },
    include: {
      items: {
        include: { post: true },
        orderBy: { order: "asc" }, // ✅ 按顺序渲染
      },
    },
  });

  if (!album || album.userId !== session?.user.id) return notFound();

  async function deleteItem(formData: FormData) {
    "use server";
    const itemId = formData.get("itemId") as string;
    await prisma.memoryAlbumItem.delete({ where: { id: itemId } });
    revalidatePath(`/me/albums/${album.id}`);
  }

  async function updateNote(formData: FormData) {
    "use server";
    const itemId = formData.get("itemId") as string;
    const note = formData.get("note") as string;
    await prisma.memoryAlbumItem.update({ where: { id: itemId }, data: { note } });
    revalidatePath(`/me/albums/${album.id}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{album.name}</h1>

      {album.items.length === 0 ? (
        <p className="text-gray-500">This album is empty.</p>
      ) : (
        <SortableAlbumItemList
          items={album.items}
          albumId={album.id}
          updateNote={updateNote}
          deleteItem={deleteItem}
        />
      )}
    </div>
  );
}
