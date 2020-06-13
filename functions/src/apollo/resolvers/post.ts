import { Post } from "../../models/post";
import { Context } from "../context";

export default {
  answers: (source: Post, _: any, { batchLoaders }: Context) =>
    batchLoaders.getAnswersInPost({ postId: source.id }),
  author: (source: Post, _: any, { batchLoaders }: Context) =>
    batchLoaders.getUserProfile({ userId: source.authorId }),
};
