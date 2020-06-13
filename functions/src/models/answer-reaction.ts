import { ReactionType } from "./reaction";

export interface AnswerReaction {
  readonly id: string;
  readonly type: ReactionType;
  readonly authorId: string;
  readonly createdAt: Date;
}
