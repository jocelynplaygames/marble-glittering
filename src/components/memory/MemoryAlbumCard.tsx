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
    <div className="p-4 rounded shadow transition bg-white hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800">
      <h2 className="text-lg font-semibold text-black dark:text-white">{name}</h2>
      <p className="text-sm text-muted-foreground dark:text-zinc-400">
        {count} posts - {visibilityLabel[visibility]}
      </p>
    </div>
  );
}
