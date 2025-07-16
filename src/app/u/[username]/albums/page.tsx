// Page displaying all albums of a user
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

  if (!user) return <div className="text-center mt-10 text-gray-500">User not found</div>;

  const visibleAlbums = user.albums.filter((album) => {
    if (isOwner) return true;
    if (album.visibility === "PUBLIC") return true;
    if (album.visibility === "FRIENDS" && session?.user?.id) {
      // TODO: Implement friend check logic (if you have a friends table)
      return true; // Currently allowing by default
    }
    return false;
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isOwner ? "📁 My Collections" : `📁 ${params.username}'s Public Albums`}
      </h1>

      {isOwner && (
        <Link
          href="/me/albums/create"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-600"
        >
          ➕ Create New Album
        </Link>
      )}

      {visibleAlbums.length === 0 ? (
        <p className="text-gray-500">No albums available to view</p>
      ) : (
        <div className="space-y-4">
          {visibleAlbums.map((album) => (
            <div
              key={album.id}
              className="rounded-lg p-4 border bg-white shadow-sm hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-semibold">{album.name}</h2>
              <p className="text-sm text-gray-600">{album.items.length} items</p>
              <Link
                href={`/u/${user.username}/albums/${album.id}`}
                className="text-blue-500 text-sm mt-2 inline-block hover:underline"
              >
                View Album →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}  