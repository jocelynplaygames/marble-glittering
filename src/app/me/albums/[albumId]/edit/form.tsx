// app/me/albums/[albumId]/edit/form.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

interface EditAlbumFormProps {
  albumId: string;
  initialName: string;
  initialDescription: string;
  initialVisibility: "PRIVATE" | "FRIENDS" | "PUBLIC"; // 👈 新增
}

export function EditAlbumForm({
  albumId,
  initialName,
  initialDescription,
  initialVisibility,
}: EditAlbumFormProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [visibility, setVisibility] = useState(initialVisibility); // 👈 可见性设置
  const router = useRouter();

  async function handleUpdate() {
    try {
      await axios.patch("/api/memory/update", {
        id: albumId,
        name,
        description,
        visibility, // 👈 传给后端
      });
      alert("保存成功！");
      router.push("/me/albums");
    } catch (err) {
      console.error(err);
      alert("保存失败！");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">专辑名称</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">描述</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">可见性</label>
        <select
          value={visibility}
          onChange={(e) =>
            setVisibility(e.target.value as "PRIVATE" | "FRIENDS" | "PUBLIC")
          }
          className="w-full border px-3 py-2 rounded"
        >
          <option value="PRIVATE">仅自己可见</option>
          <option value="FRIENDS">公开给好友</option>
          <option value="PUBLIC">所有人可见</option>
        </select>
      </div>

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        保存修改
      </button>
    </div>
  );
}
