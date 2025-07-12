//支持拖动的单个卡片
// components/SortableItem.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({ item, updateNote, deleteItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border rounded-lg p-4 shadow bg-white"
    >
      <a href={`/m/${item.post.marbleId}/post/${item.postId}`}>
        <h2 className="text-lg font-semibold hover:underline">{item.post.title}</h2>
      </a>

      <p className="text-sm text-gray-600 mt-1">
        Saved at: {new Date(item.addedAt).toLocaleString()}
      </p>

      {/* 编辑备注 */}
      <form action={updateNote} className="mt-4 flex flex-col gap-2">
        <input type="hidden" name="itemId" value={item.id} />
        <label className="text-sm font-medium">Note</label>
        <textarea
          name="note"
          defaultValue={item.note ?? ""}
          className="border rounded p-2 w-full"
          rows={2}
        />
        <button
          type="submit"
          className="self-start bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
        >
          Save Note
        </button>
      </form>

      {/* 删除按钮 */}
      <form action={deleteItem} className="mt-2">
        <input type="hidden" name="itemId" value={item.id} />
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Delete from album
        </button>
      </form>
    </div>
  );
}
