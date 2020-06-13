import { Context } from "../context";
import { Comment } from "../../models/comment";
import { ReactionType } from "../../models/reaction";

export default {
  liked: async (source: Comment, _: any, { userId, batchLoaders }: Context) => {
    if (!userId) {
      return false;
    }

    const reaction = await batchLoaders.getCommentReaction({
      postId: source.postId,
      answerId: source.answerId,
      commentId: source.id,
      userId,
    });

    return reaction?.type === ReactionType.like ?? false;
  },
  disliked: async (
    source: Comment,
    _: any,
    { userId, batchLoaders }: Context
  ) => {
    if (!userId) {
      return false;
    }

    const reaction = await batchLoaders.getCommentReaction({
      postId: source.postId,
      answerId: source.answerId,
      commentId: source.id,
      userId,
    });

    return reaction?.type === ReactionType.dislike ?? false;
  },
  author: (source: Comment, _: any, { batchLoaders }: Context) =>
    batchLoaders.getUserProfile({ userId: source.authorId }),
  answer: (source: Comment, _: any, { batchLoaders }: Context) =>
    batchLoaders.getAnswer({
      postId: source.postId,
      answerId: source.answerId,
    }),
};
