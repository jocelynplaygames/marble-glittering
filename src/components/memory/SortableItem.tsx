"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { format } from "date-fns";

export function SortableItem({ item, albumId, updateNote, deleteItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const slug = item.post?.marble?.slug;
  const postId = item.post?.id;
  const title = item.post?.title;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 shadow bg-white dark:bg-zinc-900 dark:border-zinc-700"
    >
      <div
        className="cursor-move text-gray-400 text-sm mb-2 dark:text-zinc-500"
        {...attributes}
        {...listeners}
      >
        ☰ Drag
      </div>

      {slug && postId ? (
        <Link href={`/m/${slug}/post/${postId}`}>
          <h2 className="text-lg font-semibold hover:underline dark:text-white">{title}</h2>
        </Link>
      ) : (
        <h2 className="text-lg font-semibold text-gray-400 dark:text-zinc-500">
          {title ?? "Untitled Post"}
        </h2>
      )}

      <p className="text-sm text-gray-600 mt-1 dark:text-zinc-400">
        Saved at: {format(new Date(item.addedAt), "yyyy-MM-dd HH:mm:ss")}
      </p>

      <form className="mt-4 flex flex-col gap-2" action={updateNote}>
        <input type="hidden" name="itemId" value={item.id} />
        <input type="hidden" name="albumId" value={albumId} />
        <label className="text-sm font-medium dark:text-zinc-300">Note</label>
        <textarea
          name="note"
          defaultValue={item.note ?? ""}
          className="border rounded p-2 w-full dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
          rows={2}
        />
        <button
          type="submit"
          className="self-start bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
        >
          Save Note
        </button>
      </form>

      <form action={deleteItem} className="mt-2">
        <input type="hidden" name="itemId" value={item.id} />
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Delete from album
        </button>
      </form>
    </div>
  );
}
