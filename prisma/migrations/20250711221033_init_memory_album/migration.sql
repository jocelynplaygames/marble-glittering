-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PRIVATE', 'FRIENDS', 'PUBLIC');

-- CreateTable
CREATE TABLE "MemoryAlbum" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemoryAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryAlbumItem" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "note" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemoryAlbumItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemoryAlbum" ADD CONSTRAINT "MemoryAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryAlbumItem" ADD CONSTRAINT "MemoryAlbumItem_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "MemoryAlbum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryAlbumItem" ADD CONSTRAINT "MemoryAlbumItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
