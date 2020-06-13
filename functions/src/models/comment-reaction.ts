import { ReactionType } from "./reaction";

export interface CommentReaction {
  readonly id: string;
  readonly type: ReactionType;
  readonly authorId: string;
  readonly createdAt: Date;
}
