"use client";
//创建新专辑

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

export default function CreateAlbumPage() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const res = await fetch("/api/memory/create", {
      method: "POST",
      body: JSON.stringify({ title: name, desc: note }),
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

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">名称</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium">备注（可选）</label>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <Button onClick={handleSubmit}>创建</Button>
      </div>
    </div>
  );
}
