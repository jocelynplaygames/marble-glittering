//创建 / 编辑记忆专辑的表单组件（字段：名称、描述、可见性）
"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Visibility } from "@prisma/client";
import { toast } from "~/components/ui/use-toast";
import type { NextRequest } from 'next/server'


export interface MemoryAlbumFormValues {
  name: string;
  description: string;
  visibility: Visibility;
}

interface MemoryAlbumFormProps {
  defaultValues?: Partial<MemoryAlbumFormValues>;
  onSubmit: (data: MemoryAlbumFormValues) => void | Promise<void>;
  submitting?: boolean;
}

export function MemoryAlbumForm({
  defaultValues = {},
  onSubmit,
  submitting = false,
}: MemoryAlbumFormProps) {
  const [name, setName] = useState(defaultValues.name ?? "");
  const [description, setDescription] = useState(defaultValues.description ?? "");
  const [visibility, setVisibility] = useState<Visibility>(defaultValues.visibility ?? "PRIVATE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("提交表单数据：", { name, description, visibility });
    toast({
      title: "正在提交",
      description: `名称：${name}，描述：${description}，可见性：${visibility}`,
    });
    onSubmit({ name, description, visibility });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>名称</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="如：童年回忆"
          required
        />
      </div>

      <div>
        <Label>描述</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="可写一些介绍说明"
        />
      </div>

      <div>
        <Label>可见性</Label>
        <RadioGroup
          value={visibility}
          onValueChange={(val) => {
            toast(`设置可见性：${val}`);
            setVisibility(val as Visibility);
          }}
          className="flex gap-4 mt-2"
        >
           <div>
            <RadioGroupItem value="PRIVATE" id="r1" />
            <Label htmlFor="r1">仅自己可见</Label>
          </div>

          <div>
            <RadioGroupItem value="FRIENDS" id="r2" />
            <Label htmlFor="r2">好友可见</Label>
          </div>

          <div>
            <RadioGroupItem value="PUBLIC" id="r3" />
            <Label htmlFor="r3">公开</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "提交中..." : "提交"}
      </Button>
    </form>
  );
}

