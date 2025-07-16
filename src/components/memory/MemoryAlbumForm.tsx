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
    console.log("Submitting form data:", { name, description, visibility });
    toast({
      title: "Submitting",
      description: `Name: ${name}, Description: ${description}, Visibility: ${visibility}`,
    });
    onSubmit({ name, description, visibility });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Childhood Memories"
          required
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="You can write some introductory description"
        />
      </div>

      <div>
        <Label>Visibility</Label>
        <RadioGroup
          value={visibility}
          onValueChange={(val) => {
            toast(`Setting visibility to: ${val}`);
            setVisibility(val as Visibility);
          }}
          className="flex gap-4 mt-2"
        >
          <div>
            <RadioGroupItem value="PRIVATE" id="r1" />
            <Label htmlFor="r1">Only Me</Label>
          </div>

          <div>
            <RadioGroupItem value="FRIENDS" id="r2" />
            <Label htmlFor="r2">Visible to Friends</Label>
          </div>

          <div>
            <RadioGroupItem value="PUBLIC" id="r3" />
            <Label htmlFor="r3">Public</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
