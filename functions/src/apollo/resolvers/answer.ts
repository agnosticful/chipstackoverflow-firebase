import { Context } from "../context";
import { Answer } from "../../models/answer";
import { ReactionType } from "../../models/reaction";

export default {
  liked: async (source: Answer, _: any, { userId, batchLoaders }: Context) => {
    if (!userId) {
      return false;
    }

    const reaction = await batchLoaders.getAnswerReaction({
      postId: source.postId,
      answerId: source.id,
      userId,
    });

    return reaction?.type === ReactionType.like ?? false;
  },
  disliked: async (
    source: Answer,
    _: any,
    { userId, batchLoaders }: Context
  ) => {
    if (!userId) {
      return false;
    }

    const reaction = await batchLoaders.getAnswerReaction({
      postId: source.postId,
      answerId: source.id,
      userId,
    });

    return reaction?.type === ReactionType.dislike ?? false;
  },
  comments: (source: Answer, _: any, { batchLoaders }: Context) =>
    batchLoaders.getCommentsInAnswer({
      postId: source.postId,
      answerId: source.id,
    }),
  author: (source: Answer, _: any, { batchLoaders }: Context) =>
    batchLoaders.getUserProfile({ userId: source.authorId }),
  post: (source: Answer, _: any, { batchLoaders }: Context) =>
    batchLoaders.getPost({ postId: source.postId }),
};
