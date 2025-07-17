"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import { Button } from "~/components/ui/button";
import { Button } from "~/components/client-only";
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
        <h1 className="text-2xl font-bold">📚 My Memory Albums</h1>
        <Button asChild>
          <Link href="/me/albums/create">➕ Create New Album</Link>
        </Button>
      </div>

      {loading || status === "loading" ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Failed to fetch albums. Please try again later.</p>
      ) : albums.length === 0 ? (
        <p className="text-gray-500">
          You don't have any albums yet. Click the button in the top right to create one!
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

              {/* Action buttons can be placed at the bottom right or below the card */}
              <div className="flex gap-2 mt-2">
                <Button asChild variant="secondary">
                  <Link href={`/me/albums/${album.id}`}>View</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/me/albums/${album.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
