import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache"; // revalidatePath() is an App Router server API, used only inside "use server" functions and imported from "next/cache"
import { SortableAlbumItemList } from "~/components/memory/SortableAlbumItemList";
import { MemoryAlbumCard } from "~/components/memory/MemoryAlbumCard";
import Link from "next/link";

export async function updateNote(formData: FormData) {
  "use server";
  const itemId = formData.get("itemId") as string;
  const note = formData.get("note") as string;
  const albumId = formData.get("albumId") as string;

  await prisma.memoryAlbumItem.update({
    where: { id: itemId },
    data: { note },
  });

  revalidatePath(`/me/albums/${albumId}`); // Revalidate the cache (optional)
  // ✅ Force refresh to prevent old data from being rendered
  redirect(`/me/albums/${albumId}`);
}

export async function deleteItem(formData: FormData) {
  "use server";
  const itemId = formData.get("itemId") as string;
  const albumId = formData.get("albumId") as string;

  await prisma.memoryAlbumItem.delete({
    where: { id: itemId },
  });

  revalidatePath(`/me/albums/${albumId}`);
  redirect(`/me/albums`); // ✅ 回退到所有相册列表页

}

export default async function AlbumDetailPage({ params }: { params: { albumId: string } }) {
  const { albumId } = params;
  const session = await getServerAuthSession();

  const album = await prisma.memoryAlbum.findUnique({
    where: { id: albumId },
    include: {
      items: {
        include: {
          post: {
            include: {
              marble: true, // Key point: fetch slug
            },
          },
        },
        orderBy: { order: "asc" }, // Render in specified order
      },
    },
  });

  if (!album || album.userId !== session?.user.id) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{album.name}</h1>

      <Link href="/me/albums" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Back to My Albums
      </Link>

      <MemoryAlbumCard
        name={album.name}
        count={album.items.length}
        visibility={album.visibility} // Pass enum directly, no need to use toLowerCase
      />

      {/* Optional: extra info like description/creation time */}
      <p className="text-sm text-muted-foreground">
        This album contains {album.items.length} post(s), created on{" "}
        {new Date(album.createdAt).toLocaleDateString()}.
      </p>

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
