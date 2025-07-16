import type { Visibility } from "@prisma/client";

interface MemoryAlbumCardProps {
  name: string;
  count: number;
  visibility: Visibility;
}

export function MemoryAlbumCard({ name, count, visibility }: MemoryAlbumCardProps) {
  const visibilityLabel: Record<Visibility, string> = {
    PRIVATE: "Private",
    PUBLIC: "Public",
    FRIENDS: "Friends Only",
  };

  return (
    <div className="p-4 bg-white shadow rounded hover:bg-gray-50 transition">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-muted-foreground">
        {count} posts - {visibilityLabel[visibility]}
      </p>
    </div>
  );
}
