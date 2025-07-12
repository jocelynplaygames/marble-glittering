"use client";

import { useState } from "react";
import { PostComment } from "./post-comment";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Comment, CommentVote, User } from "@prisma/client";

type NestedComment = Comment & {
  author: User;
  votes: CommentVote[];
  replies?: NestedComment[];
};

interface RecursiveCommentProps {
  comment: NestedComment;
  postId: string;
  sessionUserId?: string;
  depth: number;
}

export function RecursiveComment({
  comment,
  postId,
  sessionUserId,
  depth,
}: RecursiveCommentProps) {
  const [collapsed, setCollapsed] = useState(false);

  const voteCount = comment.votes.reduce((acc, vote) => {
    return vote.type === "UP" ? acc + 1 : vote.type === "DOWN" ? acc - 1 : acc;
  }, 0);

  const currentVote = comment.votes.find(
    (vote) => vote.userId === sessionUserId
  );

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div
      className="pl-2 border-l border-zinc-200 mb-4"
      style={{ marginLeft: depth * 16 }}
    >
      <PostComment
        postId={postId}
        comment={comment}
        currentVote={currentVote}
        voteCount={voteCount}
      />

      {hasReplies && (
        <Button
          variant="ghost"
          className="mt-1 text-xs text-muted-foreground hover:underline"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <>
              <ChevronRight className="h-4 w-4 mr-1" />
              Show {comment.replies.length} repl
              {comment.replies.length > 1 ? "ies" : "y"}
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Hide {comment.replies.length} repl
              {comment.replies.length > 1 ? "ies" : "y"}
            </>
          )}
        </Button>
      )}

      {!collapsed &&
        comment.replies?.map((reply) => (
          <RecursiveComment
            key={reply.id}
            comment={reply}
            postId={postId}
            sessionUserId={sessionUserId}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}
