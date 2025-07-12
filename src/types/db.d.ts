import type { Comment, Post, Marble, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
  author: User;
  comments: Comment[];
  marble: Marble;
  votes: Vote[];
};
