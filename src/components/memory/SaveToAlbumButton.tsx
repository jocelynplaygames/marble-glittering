//components/memory/SaveToAlbumButton
// "Save to Album" button on post detail page (dialog, select album, add note, submit)
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
// import { Button } from "../ui/button";
import { Button } from "~/components/ui/button";

import { Textarea } from "../ui/textarea";
import { MemoryAlbumForm, type MemoryAlbumFormValues } from "./MemoryAlbumForm";


interface Props {
  postId: string;
}

export function SaveToAlbumButton({ postId }: Props) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [albums, setAlbums] = useState<{ id: string; name: string }[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);


  // Fetch current user's albums
  useEffect(() => {
    if (open) {
      fetch("/api/memory/list")
        .then((res) => res.json())
        .then((data) => {
          setAlbums(data);
          if (data.length > 0) {
            setSelectedAlbumId(data[0].id);
          }
        })
        .catch(() => setAlbums([]));
    }
  }, [open]);

  // Create new album
  const handleCreateAlbum = async (data: MemoryAlbumFormValues) => {
    const res = await fetch("/api/memory/create", {
      method: "POST",
      body: JSON.stringify({
        title: data.name,
        desc: data.description,
        visibility: data.visibility,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      alert("Failed to create album");
      return;
    }

    const newAlbum = await res.json();
    setAlbums((prev) => [...prev, newAlbum]);
    setSelectedAlbumId(newAlbum.id);
    setCreating(false);
  };


  // Submit save to album
  const handleSubmit = async () => {
    if (!selectedAlbumId) return;

    await fetch("/api/memory/add-item", {
      method: "POST",
      body: JSON.stringify({ albumId: selectedAlbumId, postId, note }),
      headers: { "Content-Type": "application/json" },
    });

    setOpen(false);
    setNote("");
    setSelectedAlbumId(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">📌 Save to Album</Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-lg font-bold">📌 Save to Album</h2>

        <div className="space-y-3">
          {albums.length > 0 ? (
            <>
              <div className="space-y-2">
                {albums.map((a) => (
                  <label key={a.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="album"
                      value={a.id}
                      checked={selectedAlbumId === a.id}
                      onChange={() => setSelectedAlbumId(a.id)}
                    />
                    <span>{a.name}</span>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">You don't have any albums yet</p>
          )}

          {/* Create new album section */}
          {creating ? (
            <div className="border-t pt-4 mt-4">
              <MemoryAlbumForm
                onSubmit={handleCreateAlbum}
                defaultValues={{ name: "", description: "", visibility: "private" }}
              />
              <Button
                variant="ghost"
                className="mt-2"
                onClick={() => setCreating(false)}
              >
                Cancel Creation
              </Button>
            </div>
          ) : (
            <Button variant="link" onClick={() => setCreating(true)}>
              ➕ Create New Album
            </Button>
          )}

          <Textarea
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={!selectedAlbumId}>
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}    