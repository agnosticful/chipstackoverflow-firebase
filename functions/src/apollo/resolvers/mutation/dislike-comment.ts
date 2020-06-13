import { AuthenticationError, UserInputError } from "apollo-server-core";
import { firestore } from "firebase-admin";
import { FirestoreCommentReactionInput } from "../../../models/firestore/comment-reaction";
import { FirestoreUserProfile } from "../../../models/firestore/user-profile";
import { Context } from "../../context";

export default async (
  _: any,
  {
    postId,
    answerId,
    commentId,
  }: { postId: string; answerId: string; commentId: string },
  { userId }: Context
) => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  const authorReference = firestore()
    .collection("userProfiles")
    .doc(userId) as firestore.DocumentReference<FirestoreUserProfile>;
  const commentReference = firestore()
    .collection("posts")
    .doc(postId)
    .collection("answers")
    .doc(answerId)
    .collection("comments")
    .doc(commentId);

  await firestore().runTransaction(async (transaction) => {
    if (!(await transaction.get(commentReference)).exists) {
      throw new UserInputError(
        `The comment (post id: ${postId}, answer id: ${answerId}, id: ${commentId}) does not exist.`
      );
    }

    const reactionsSnapshot = await commentReference
      .collection("reactions")
      .where("author", "==", authorReference)
      .limit(1)
      .get();

    if (!reactionsSnapshot.empty) {
      transaction.delete(reactionsSnapshot.docs[0].ref);
    }

    transaction.create(commentReference.collection("reactions").doc(), {
      type: "DISLIKE",
      author: authorReference,
      comment: commentReference,
      createdAt: firestore.FieldValue.serverTimestamp(),
    } as FirestoreCommentReactionInput);
  });

  return true;
};
