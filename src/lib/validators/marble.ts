import { z } from "zod";

export const MarbleValidator = z.object({
  name: z.string().min(3).max(21),//你的前端发给 /api/marble 的 payload 必须是3 到 21 个字符之间
});

export const MarbleSubscriptionValidator = z.object({
  marbleId: z.string(),
});

export type CreateMarblePayload = z.infer<typeof MarbleValidator>;
export type SubscribeToMarblePayload = z.infer<
  typeof marbleSubscriptionValidator
>;
