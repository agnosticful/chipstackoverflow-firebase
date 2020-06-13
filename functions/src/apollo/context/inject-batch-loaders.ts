import { UserInputError } from "apollo-server-core";
import DataLoader from "dataloader";
import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";
import { Answer } from "../../models/answer";
import { AnswerReaction } from "../../models/answer-reaction";
import { Comment } from "../../models/comment";
import { CommentReaction } from "../../models/comment-reaction";
import { FirestoreAnswer } from "../../models/firestore/answer";
import { FirestoreAnswerReaction } from "../../models/firestore/answer-reaction";
import { FirestoreComment } from "../../models/firestore/comment";
import { FirestoreCommentReaction } from "../../models/firestore/comment-reaction";
import { FirestorePost } from "../../models/firestore/post";
import { FirestoreUserProfile } from "../../models/firestore/user-profile";
import { Post } from "../../models/post";
import { UserProfile } from "../../models/user-profile";
import { deserializeAnswer } from "../../serializers/answer";
import { deserializeAnswerReaction } from "../../serializers/answer-reaction";
import { deserializeComment } from "../../serializers/comment";
import { deserializeCommentReaction } from "../../serializers/comment-reaction";
import { deserializePost } from "../../serializers/post";
import { deserializeUserProfile } from "../../serializers/user-profile";
import { Context } from ".";

export interface BatchLoaders {
  getUserProfile: (params: { userId: string }) => Promise<UserProfile>;
  getPost: (params: { postId: string }) => Promise<Post>;
  getAnswer: (params: { postId: string; answerId: string }) => Promise<Answer>;
  getAnswersInPost: (params: { postId: string }) => Promise<Answer[]>;
  getAnswerReaction: (params: {
    postId: string;
    answerId: string;
    userId: string;
  }) => Promise<AnswerReaction | null>;
  getCommentsInAnswer: (params: {
    postId: string;
    answerId: string;
  }) => Promise<Comment[]>;
  getCommentReaction: (params: {
    postId: string;
    answerId: string;
    commentId: string;
    userId: string;
  }) => Promise<CommentReaction | null>;
}

export default async (
  _: functions.https.Request,
  context: Context
): Promise<Context> => {
  const userProfileLoader = new DataLoader<{ userId: string }, UserProfile>(
    async (params) => {
      const userProfiles = new Map<string, UserProfile>();

      await Promise.all(
        [...new Set(params.map(({ userId }) => userId))].map(async (userId) => {
          const snapshot = (await firestore()
            .collection("userProfiles")
            .doc(userId)
            .get()) as firestore.DocumentSnapshot<FirestoreUserProfile>;

          if (!snapshot.exists) {
            throw new UserInputError(
              `The user (id: ${userId}) does not exist.`
            );
          }

          userProfiles.set(userId, deserializeUserProfile(snapshot));
        })
      );

      return params.map(({ userId }) => userProfiles.get(userId)!);
    }
  );

  const postLoader = new DataLoader<{ postId: string }, Post>(
    async (params) => {
      const posts = new Map<string, Post>();

      await Promise.all(
        [...new Set(params.map(({ postId }) => postId))].map(async (postId) => {
          const snapshot = (await firestore()
            .collection("posts")
            .doc(postId)
            .get()) as firestore.DocumentSnapshot<FirestorePost>;

          posts.set(postId, deserializePost(snapshot));
        })
      );

      return params.map(({ postId }) => posts.get(postId)!);
    }
  );

  const answerLoader = new DataLoader<
    { postId: string; answerId: string },
    Answer
  >(async (params) => {
    const keyParamsPairs = new Map(
      params.map(({ postId, answerId }) => [
        `${postId}/${answerId}`,
        { postId, answerId },
      ])
    );
    const answerReactions = new Map<string, Answer>();

    await Promise.all(
      [...keyParamsPairs.entries()].map(async ([key, { postId, answerId }]) => {
        const answerSnapshot = (await firestore()
          .collection("posts")
          .doc(postId)
          .collection("answers")
          .doc(answerId)
          .get()) as firestore.DocumentSnapshot<FirestoreAnswer>;

        if (!answerSnapshot.exists) {
          throw new UserInputError(
            `The answer (post id: ${postId}, id: ${answerId}) does not exist.`
          );
        }

        answerReactions.set(key, deserializeAnswer(answerSnapshot));
      })
    );

    return params.map(
      ({ postId, answerId }) => answerReactions.get(`${postId}/${answerId}`)!
    );
  });

  const childAnswersLoader = new DataLoader<{ postId: string }, Answer[]>(
    async (params) => {
      const answers = new Map<string, Answer[]>();

      await Promise.all(
        [...new Set(params.map(({ postId }) => postId))].map(async (postId) => {
          const postReference = firestore().collection("posts").doc(postId);

          if (!(await postReference.get()).exists) {
            throw new UserInputError(
              `The post (id: ${postId}) does not exist.`
            );
          }

          const answersSnapshot = (await postReference
            .collection("answers")
            .orderBy("createdAt", "desc")
            .limit(20)
            .get()) as firestore.QuerySnapshot<FirestoreAnswer>;

          answers.set(
            postId,
            answersSnapshot.docs.map((doc) => deserializeAnswer(doc))
          );
        })
      );

      return params.map(({ postId }) => answers.get(postId)!);
    }
  );

  const answerReactionLoader = new DataLoader<
    { postId: string; answerId: string; userId: string },
    AnswerReaction | null
  >(async (params) => {
    const keyParamsPairs = new Map(
      params.map(({ postId, answerId, userId }) => [
        `${postId}/${answerId}/${userId}`,
        { postId, answerId, userId },
      ])
    );
    const answerReactions = new Map<string, AnswerReaction | null>();

    await Promise.all(
      [...keyParamsPairs.entries()].map(
        async ([key, { postId, answerId, userId }]) => {
          const answerReference = firestore()
            .collection("posts")
            .doc(postId)
            .collection("answers")
            .doc(answerId);
          const answersSnapshot = await answerReference.get();

          if (!answersSnapshot.exists) {
            throw new UserInputError(
              `The answer (post id: ${postId}, id: ${answerId}) does not exist.`
            );
          }

          const reactionSnapshot = (await answerReference
            .collection("reactions")
            .where(
              "author",
              "==",
              firestore().collection("userProfiles").doc(userId)
            )
            .limit(1)
            .get()) as firestore.QuerySnapshot<FirestoreAnswerReaction>;

          if (reactionSnapshot.empty) {
            answerReactions.set(key, null);
          } else {
            answerReactions.set(
              key,
              deserializeAnswerReaction(reactionSnapshot.docs[0])
            );
          }
        }
      )
    );

    return params.map(
      ({ postId, answerId, userId }) =>
        answerReactions.get(`${postId}/${answerId}/${userId}`)!
    );
  });

  const childCommentsLoader = new DataLoader<
    { postId: string; answerId: string },
    Comment[]
  >(async (params) => {
    const keyParamsPairs = new Map(
      params.map(({ postId, answerId }) => [
        `${postId}/${answerId}`,
        { postId, answerId },
      ])
    );
    const comments = new Map<string, Comment[]>();

    await Promise.all(
      [...keyParamsPairs.entries()].map(async ([key, { postId, answerId }]) => {
        const answersReference = firestore()
          .collection("posts")
          .doc(postId)
          .collection("answers")
          .doc(answerId);

        if (!(await answersReference.get()).exists) {
          throw new UserInputError(
            `The answer (post id: ${postId}, id: ${answerId}) does not exist.`
          );
        }

        const commentsSnapshot = (await answersReference
          .collection("comments")
          .orderBy("createdAt", "desc")
          .limit(20)
          .get()) as firestore.QuerySnapshot<FirestoreComment>;

        comments.set(
          key,
          commentsSnapshot.docs.map((doc) => deserializeComment(doc))
        );
      })
    );

    return params.map(
      ({ postId, answerId }) => comments.get(`${postId}/${answerId}`)!
    );
  });

  const commentReactionLoader = new DataLoader<
    { postId: string; answerId: string; commentId: string; userId: string },
    CommentReaction | null
  >(async (params) => {
    const keyParamsPairs = new Map(
      params.map(({ postId, answerId, commentId, userId }) => [
        `${postId}/${answerId}/${commentId}/${userId}`,
        { postId, answerId, commentId, userId },
      ])
    );
    const commentReactions = new Map<string, CommentReaction | null>();

    await Promise.all(
      [...keyParamsPairs.entries()].map(
        async ([key, { postId, answerId, commentId, userId }]) => {
          const commentReference = firestore()
            .collection("posts")
            .doc(postId)
            .collection("answers")
            .doc(answerId)
            .collection("comments")
            .doc(commentId);

          if (!(await commentReference.get()).exists) {
            throw new UserInputError(
              `The comment (post id: ${postId}, answer id: ${answerId}, id: ${commentId}) does not exist.`
            );
          }

          const reactionSnapshot = (await commentReference
            .collection("reactions")
            .where(
              "author",
              "==",
              firestore().collection("userProfiles").doc(userId)
            )
            .limit(1)
            .get()) as firestore.QuerySnapshot<FirestoreCommentReaction>;

          if (reactionSnapshot.empty) {
            commentReactions.set(key, null);
          } else {
            commentReactions.set(
              key,
              deserializeCommentReaction(reactionSnapshot.docs[0])
            );
          }
        }
      )
    );

    return params.map(
      ({ postId, answerId, commentId, userId }) =>
        commentReactions.get(`${postId}/${answerId}/${commentId}/${userId}`)!
    );
  });

  return {
    ...context,
    batchLoaders: {
      getUserProfile: (params) => userProfileLoader.load(params),
      getPost: (params) => postLoader.load(params),
      getAnswer: (params) => answerLoader.load(params),
      getAnswersInPost: (params) => childAnswersLoader.load(params),
      getAnswerReaction: (params) => answerReactionLoader.load(params),
      getCommentsInAnswer: (params) => childCommentsLoader.load(params),
      getCommentReaction: (params) => commentReactionLoader.load(params),
    },
  };
};
