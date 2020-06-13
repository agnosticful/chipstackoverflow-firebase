import { AuthenticationError, UserInputError } from "apollo-server-core";
import { firestore } from "firebase-admin";
import {
  Comment,
  CommentBody,
  assertCommentBody,
} from "../../../models/comment";
import {
  FirestoreComment,
  FirestoreCommentInput,
} from "../../../models/firestore/comment";
import { deserializeComment } from "../../../serializers/comment";
import { Context } from "../../context";

export default async (
  _: any,
  {
    postId,
    answerId,
    body,
  }: { postId: string; answerId: string; body: string },
  { userId }: Context
): Promise<Comment> => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  validateBody(body);

  const commentReference = await firestore().runTransaction(
    async (transaction) => {
      const answerReference = firestore()
        .collection("posts")
        .doc(postId)
        .collection("answers")
        .doc(answerId);

      if (!(await transaction.get(answerReference)).exists) {
        throw new UserInputError(
          `The answer (post id: ${postId}, id: ${answerId}) does not exist.`
        );
      }

      const commentReference = answerReference.collection("comments").doc();

      transaction.create(commentReference, {
        body,
        likes: 0,
        dislikes: 0,
        author: firestore().collection("userProfiles").doc(userId),
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
      } as FirestoreCommentInput);

      return commentReference;
    }
  );

  return deserializeComment(
    (await commentReference.get()) as firestore.DocumentSnapshot<
      FirestoreComment
    >
  );
};

function validateBody(body: string): asserts body is CommentBody {
  try {
    assertCommentBody(body, "body");
  } catch (error) {
    throw new UserInputError(error.message);
  }
}
