// src/app/memory/page.tsx
import React from 'react'
import { CreateMemoryAlbumButton } from "@/components/memory-album-form"

{/* 原按钮替换 */}
<CreateMemoryAlbumButton />



export default function MemoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📒 你的记忆专辑</h1>

      {/* 创建新专辑按钮 */}
      <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80">
        创建新专辑
      </button>

      {/* 专辑列表（占位） */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">童年回忆</h2>
          <p className="text-sm text-muted-foreground">5 篇贴文 - 私密</p>
        </div>
      </div>
    </div>
  )
}
