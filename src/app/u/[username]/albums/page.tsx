
//展示某个用户的所有专辑（Album）页面
// app/u/[username]/albums/page.tsx
import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";

export default async function AlbumsPage({ params }: { params: { username: string } }) {
  const session = await getServerAuthSession();
  const isOwner = session?.user?.username === params.username;

  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      albums: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  if (!user) return <div className="text-center mt-10 text-gray-500">用户不存在</div>;

  const visibleAlbums = user.albums.filter((album) => {
    if (isOwner) return true;
    if (album.visibility === "PUBLIC") return true;
    if (album.visibility === "FRIENDS" && session?.user?.id) {
      // TODO: 实现好友判断逻辑（你有好友表的话）
      return true; // 目前默认允许
    }
    return false;
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isOwner ? "📁 我的收藏专辑" : `📁 ${params.username} 的公开专辑`}
      </h1>

      {isOwner && (
        <Link
          href="/me/albums/create"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-600"
        >
          ➕ 创建新专辑
        </Link>
      )}

      {visibleAlbums.length === 0 ? (
        <p className="text-gray-500">暂无可查看的专辑</p>
      ) : (
        <div className="space-y-4">
          {visibleAlbums.map((album) => (
            <div
              key={album.id}
              className="rounded-lg p-4 border bg-white shadow-sm hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-semibold">{album.name}</h2>
              <p className="text-sm text-gray-600">{album.items.length} 项</p>
              <Link
                href={`/u/${user.username}/albums/${album.id}`}
                className="text-blue-500 text-sm mt-2 inline-block hover:underline"
              >
                查看专辑 →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
