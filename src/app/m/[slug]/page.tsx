import { notFound } from "next/navigation";

import { MiniCreatePost, PostFeed } from "~/components";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "~/config";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

interface MarblePageProps {
  params: { slug: string };
}

export default async function MarblePage({ params }: MarblePageProps) {
  const { slug } = params;

  const session = await getServerAuthSession();

  const marble = await prisma.marble.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          comments: true,
          marble: true,
          votes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  });

  if (!marble) return notFound();

  return (
    <>
      <h1 className="h-14 text-3xl font-bold md:text-4xl">
        m/{marble.name}
      </h1>
      <MiniCreatePost session={session} slug={slug} />
      <PostFeed initialPosts={marble.posts} marbleName={marble.name} />
    </>
  );
}
