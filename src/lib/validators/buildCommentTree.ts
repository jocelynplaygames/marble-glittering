// lib/validators/buildCommentTree.ts

type CommentWithRelations = {
  id: string;
  replyToId: string | null;
  replies?: CommentWithRelations[];
  [key: string]: any; // 允许带 author、votes 等字段
};

export function buildCommentTree(comments: CommentWithRelations[]) {
  const map = new Map<string, CommentWithRelations>();
  const roots: CommentWithRelations[] = [];

  for (const comment of comments) {
    map.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of comments) {
    if (comment.replyToId) {
      const parent = map.get(comment.replyToId);
      if (parent) {
        parent.replies!.push(map.get(comment.id)!);
      }
    } else {
      roots.push(map.get(comment.id)!);
    }
  }

  return roots;
}
