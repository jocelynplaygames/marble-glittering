"use client"

import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function CreateMemoryAlbumButton() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [visibility, setVisibility] = useState<"private" | "public" | "friends">("private")

  const handleSubmit = async () => {
    try {
      await fetch("/api/memory/create", {
        method: "POST",
        body: JSON.stringify({ title, desc, visibility }),
        headers: { "Content-Type": "application/json" },
      })
      setOpen(false)
      setTitle("")
      setDesc("")
    } catch (e) {
      console.error("创建失败", e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>创建新专辑</Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-lg font-semibold">📝 创建记忆专辑</h2>

        <Label>名称</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="如：童年回忆" />

        <Label className="mt-2">描述</Label>
        <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="专辑说明（可选）" />

        <Label className="mt-2">可见性</Label>
        <RadioGroup value={visibility} onValueChange={(val) => setVisibility(val as any)} className="flex gap-4">
          <div>
            <RadioGroupItem value="private" id="r1" />
            <Label htmlFor="r1">仅自己可见</Label>
          </div>
          <div>
            <RadioGroupItem value="friends" id="r2" />
            <Label htmlFor="r2">好友可见</Label>
          </div>
          <div>
            <RadioGroupItem value="public" id="r3" />
            <Label htmlFor="r3">公开</Label>
          </div>
        </RadioGroup>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit}>创建</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
