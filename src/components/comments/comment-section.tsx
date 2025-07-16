import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { RecursiveComment } from "~/components/comments/recursive-comment";
import { CreateComment } from "~/components/comments/create-comment";
import { buildCommentTree } from "~/lib/validators/buildCommentTree";

interface CommentsSectionProps {
  postId: string;
}

export async function CommentSection({ postId }: CommentsSectionProps) {
  const session = await getServerAuthSession();

  // 获取所有评论，包含作者和投票信息
  const allComments = await prisma.comment.findMany({
    where: { postId },
    include: {
      author: true,
      votes: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // 构建嵌套评论结构
  const nestedComments = buildCommentTree(allComments);

  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <hr className="my-6 h-px w-full" />

      <CreateComment postId={postId} />

      <div className="mt-4 flex flex-col gap-y-6">
        {nestedComments.map((comment) => (
          <RecursiveComment
            key={comment.id}
            comment={comment}
            postId={postId}
            sessionUserId={session?.user.id}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}
