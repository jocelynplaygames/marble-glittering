//app/me/albums/[albumId]/edit/page.tsx
// import { EditAlbumForm } from "./form";
import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { notFound, redirect } from "next/navigation";
import { MemoryAlbumForm, type MemoryAlbumFormValues } from "~/components/memory/MemoryAlbumForm"


export default async function EditAlbumPage({ params }: { params: { albumId: string } }) {
  const session = await getServerAuthSession();

  // 获取当前用户的专辑信息（带权限校验）
  const album = await prisma.memoryAlbum.findUnique({
    where: { id: params.albumId },
  });

  if (!album || album.userId !== session?.user.id) return notFound();

  // 将编辑提交逻辑交由 MemoryAlbumForm 的 onSubmit 处理
  async function handleSubmit(data: MemoryAlbumFormValues) {
    "use server"; // server action

    await prisma.memoryAlbum.update({
      where: { id: album.id },
      data: {
        name: data.name,
        description: data.description,
        visibility: data.visibility, 
      },
    });

    redirect(`/me/albums/${album.id}`);
  }


   return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ 编辑专辑</h1>

      {/* 传入 defaultValues 预填表单内容 */}
      <MemoryAlbumForm
        onSubmit={handleSubmit}
        defaultValues={{
          name: album.name,
          description: album.description ?? "",
          visibility: album.visibility,
        }}
      />
    </div>
  );
}