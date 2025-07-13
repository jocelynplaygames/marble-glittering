"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MemoryAlbumCard } from "~/components/memory/MemoryAlbumCard";



type Album = {
  id: string;
  name: string;
  note?: string | null;
  count: number;
  visibility: "private" | "public" | "friends";
};

export default function AlbumListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/memory/list")
        .then((res) => res.json())
        .then(setAlbums)
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [status]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">📚 我的记忆专辑</h1>
        <Button asChild>
          <Link href="/me/albums/create">➕ 创建新专辑</Link>
        </Button>
      </div>

      {loading || status === "loading" ? (
        <p className="text-muted-foreground">加载中...</p>
      ) : error ? (
        <p className="text-red-500">获取专辑失败，请稍后再试。</p>
      ) : albums.length === 0 ? (
        <p className="text-gray-500">
          你还没有任何专辑。点击右上角按钮创建一个吧！
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {albums.map((album) => (
            <div key={album.id} className="relative">
              <Link href={`/me/albums/${album.id}`}>
                <MemoryAlbumCard
                  name={album.name}
                  count={album.count}
                  visibility={album.visibility}
                />
              </Link>

              {/* 操作按钮可以放在卡片右下角或下方 */}
              <div className="flex gap-2 mt-2">
                <Button asChild variant="secondary">
                  <Link href={`/me/albums/${album.id}`}>查看</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/me/albums/${album.id}/edit`}>编辑</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
