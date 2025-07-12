// components/SortableAlbumItemList.tsx
"use client";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { SortableItem } from "./SortableItem";

export function SortableAlbumItemList({ items, albumId, updateNote, deleteItem }) {
  const [sortedItems, setSortedItems] = useState(items);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedItems.findIndex((i) => i.id === active.id);
    const newIndex = sortedItems.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(sortedItems, oldIndex, newIndex);
    setSortedItems(newItems);

    fetch("/api/memory/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        albumId,
        newOrder: newItems.map((item, index) => ({
          id: item.id,
          order: index,
        })),
      }),
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sortedItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-6">
          {sortedItems.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              updateNote={updateNote}
              deleteItem={deleteItem}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
