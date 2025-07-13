//创建新专辑
//app/me/albums/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { Input } from "~/components/ui/input";
// import { Textarea } from "~/components/ui/textarea";
// import { Button } from "~/components/ui/button";
import { MemoryAlbumForm, type MemoryAlbumFormValues } from "~/components/memory/MemoryAlbumForm";

export default function CreateAlbumPage() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const router = useRouter();

  const handleSubmit = async (data: MemoryAlbumFormValues) => {
    const res = await fetch("/api/memory/create", {
      method: "POST",
      body: JSON.stringify({ title: data.name, desc: data.description, visibility: data.visibility}),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/me/albums");
    } else {
      alert("创建失败");
    }
  };

   return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">创建新专辑</h1>

      <MemoryAlbumForm onSubmit={handleSubmit} />
    </div>
  );
}
