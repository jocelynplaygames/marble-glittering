interface MemoryAlbumCardProps {
  name: string
  count: number
  visibility: 'private' | 'public' | 'friends'
}

export function MemoryAlbumCard({ name, count, visibility }: MemoryAlbumCardProps) {
  const visibilityLabel = {
    private: '私密',
    public: '公开',
    friends: '好友可见',
  }

  return (
    <div className="p-4 bg-white shadow rounded hover:bg-gray-50 transition">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-muted-foreground">
        {count} 篇贴文 - {visibilityLabel[visibility]}
      </p>
    </div>
  )
}
