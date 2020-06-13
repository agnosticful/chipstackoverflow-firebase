import { AuthenticationError, UserInputError } from "apollo-server-core";
import { firestore } from "firebase-admin";
import { FirestoreAnswerReactionInput } from "../../../models/firestore/answer-reaction";
import { FirestoreUserProfile } from "../../../models/firestore/user-profile";
import { Context } from "../../context";

export default async (
  _: any,
  { postId, answerId }: { postId: string; answerId: string },
  { userId }: Context
) => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  const authorReference = firestore()
    .collection("userProfiles")
    .doc(userId) as firestore.DocumentReference<FirestoreUserProfile>;
  const answerReference = firestore()
    .collection("posts")
    .doc(postId)
    .collection("answers")
    .doc(answerId);

  await firestore().runTransaction(async (transaction) => {
    const answerSnapshot = await transaction.get(answerReference);

    if (!answerSnapshot.exists) {
      throw new UserInputError(
        `The answer (post id: ${postId}, id: ${answerId}) does not exist.`
      );
    }

    const reactionsSnapshot = await answerReference
      .collection("reactions")
      .where("author", "==", authorReference)
      .limit(1)
      .get();

    if (!reactionsSnapshot.empty) {
      transaction.delete(reactionsSnapshot.docs[0].ref);
    }

    transaction.create(answerReference.collection("reactions").doc(), {
      type: "LIKE",
      author: authorReference,
      createdAt: firestore.FieldValue.serverTimestamp(),
    } as FirestoreAnswerReactionInput);
  });

  return true;
};
