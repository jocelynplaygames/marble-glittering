"use client";

import Image from "next/image";

type ImageItem = {
  url: string;
};

type GalleryData = {
  files: ImageItem[];
};

interface CustomGalleryRendererProps {
  data: GalleryData;
}

export function CustomGalleryRenderer({ data }: CustomGalleryRendererProps) {
  const images = data?.files ?? [];

  return (
    <div className="grid grid-cols-3 gap-2 my-4">
      {images.map((item, index) => (
        <div
          key={index}
          className="relative aspect-square overflow-hidden rounded-md border"
        >
          <Image
            src={item.url}
            alt={`gallery-${index}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
