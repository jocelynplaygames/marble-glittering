//components/post/post.tsx
import { useRef } from "react";
import Link from "next/link";
import type { Post, User, Vote } from "@prisma/client";

import { EditorOutput } from "~/components/editor-output";
import { Icons } from "~/components/icons";
import { PostVoteClient } from "~/components/post-vote/post-vote-client";
import { formatTimeToNow } from "~/lib/utils";
import { SaveToAlbumButton } from "~/components/memory/SaveToAlbumButton";
import { useSession } from "next-auth/react";


type PartialVote = Pick<Vote, "type">;

interface PostProps {

  post: Post & {
    author: User;
    votes: Vote[];
  };
  voteCount: number;
  slug: string;
  currentVote?: PartialVote;
  commentCount: number;
}

export function Post({
  post,
  voteCount,
  currentVote,
  marbleName,
  commentCount,
}: PostProps) {
  const postRef = useRef<HTMLParagraphElement>(null);
  const { data: session } = useSession();//  获取登录状态

  return (
    <div className="rounded-md bg-card shadow">
      <div className="flex justify-between px-6 py-4">
        <PostVoteClient
          postId={post.id}
          initialVoteCount={voteCount}
          initialVote={currentVote?.type}
        />

        <div className="w-0 flex-1">
          <div className="mt-1 max-h-40 text-xs text-muted-foreground">
            {marbleName && (
              <>
                <Link
                  className="text-sm text-secondary-foreground underline underline-offset-2"
                  href={`/m/${marbleName}`}
                >
                  m/{marbleName}
                </Link>
                <span className="px-1">•</span>
              </>
            )}
            <span>Posted by u/{post.author.username}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          {/* ✅ 让标题也可以点击 */}
          <Link href={`/m/${marbleName}/post/${post.id}`}>
            <h2 className="mt-2 text-lg font-semibold text-primary hover:underline">
              {post.title}
            </h2>
          </Link>

          <div
            className="relative max-h-40 w-full overflow-clip text-sm"
            ref={postRef}
          >
            <EditorOutput content={post.content} />

            {postRef.current?.clientHeight === 160 && (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-secondary to-transparent"></div>
            )}
          </div>
        </div>
      </div>

      <div className="z-20 bg-secondary px-4 py-4 text-sm sm:px-6 flex justify-between items-center">
        <Link
          href={`/m/${marbleName}/post/${post.id}`}
          className="flex items-center gap-2"
        >
          <Icons.commentReply className="h-4 w-4" />
          {commentCount} comments
        </Link>

        {/* ✅ 只有登录用户才能看到按钮 */}
        {session?.user ? (
          <SaveToAlbumButton postId={post.id} />
        ) : (
          <Link
            href="/sign-in"
            className="text-sm text-muted-foreground underline hover:text-primary"
          >
            登录后可收藏
          </Link>
        )}
      </div>
    </div>
  );
}
