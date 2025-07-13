//用于展示一个“记忆专辑”的简要信息卡片（名称 / 描述 / 贴文数量 / 公开性等）。
import type { Visibility } from "@prisma/client";

interface MemoryAlbumCardProps {
  name: string;
  count: number;
  visibility: Visibility;
}

export function MemoryAlbumCard({ name, count, visibility }: MemoryAlbumCardProps) {
  const visibilityLabel: Record<Visibility, string> = {
    PRIVATE: "私密",
    PUBLIC: "公开",
    FRIENDS: "好友可见",
  };

  return (
    <div className="p-4 bg-white shadow rounded hover:bg-gray-50 transition">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-muted-foreground">
        {count} 篇贴文 - {visibilityLabel[visibility]}
      </p>
    </div>
  );
}
