//显示某个专辑内部内容（贴文列表）的详情页

import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";//revalidatePath() 是 App Router 的服务器 API，只能：在 use server 的函数中使用，并且导入自 "next/cache"
import { SortableAlbumItemList } from "~/components/memory/SortableAlbumItemList"; 
import { MemoryAlbumCard } from "~/components/memory/MemoryAlbumCard";
import Link from "next/link";
import { propagateServerField } from "next/dist/server/lib/render-server";

export async function updateNote(formData: FormData) {
  "use server";
  const itemId = formData.get("itemId") as string;
  const note = formData.get("note") as string;
  const albumId = formData.get("albumId") as string;

  await prisma.memoryAlbumItem.update({
    where: { id: itemId },
    data: { note },
  });

  revalidatePath(`/me/albums/${albumId}`);//重新验证缓存（可保留）
  // ✅ 强制刷新页面，防止旧数据继续渲染
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
}

export default async function AlbumDetailPage({ params }: { params: { albumId: string } }) {
  const { albumId }= params;
  const session = await getServerAuthSession();

  const album = await prisma.memoryAlbum.findUnique({
    where: { id: albumId },
    include: {
      items: {
        include: { post: {
          include: {
            marble: true,//键点：拿到 slug
          }
        }
      },
      orderBy: { order: "asc" }, // 按顺序渲染
      },
    },
  });

  if (!album || album.userId !== session?.user.id) return notFound();

  

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{album.name}</h1>

      <Link href="/me/albums" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← 返回我的专辑
      </Link>

      <MemoryAlbumCard
        name={album.name}
        count={album.items.length}
        visibility={album.visibility} // 直接传 enum，不用 toLowerCase
      />
      {/* 额外描述/创建时间等可选信息 */}
      <p className="text-sm text-muted-foreground">
        总共收录了 {album.items.length} 篇贴文，创建于{" "}
        {new Date(album.createdAt).toLocaleDateString()}。
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
