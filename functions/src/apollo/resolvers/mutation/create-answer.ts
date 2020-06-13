import { AuthenticationError, UserInputError } from "apollo-server-core";
import { firestore } from "firebase-admin";
import { Answer, AnswerBody, assertAnswerBody } from "../../../models/answer";
import {
  FirestoreAnswer,
  FirestoreAnswerInput,
} from "../../../models/firestore/answer";
import { deserializeAnswer } from "../../../serializers/answer";
import { Context } from "../../context";

export default async (
  _: any,
  { postId, body }: { postId: string; body: string },
  { userId }: Context
): Promise<Answer> => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  validateBody(body);

  const answerReference = await firestore().runTransaction(
    async (transaction) => {
      const postReference = firestore().collection("posts").doc(postId);
      const postSnapshot = await transaction.get(postReference);

      if (!postSnapshot.exists) {
        throw new UserInputError(`The post (id: ${postId}) does not exist.`);
      }

      const answerReference = postReference.collection("answers").doc();

      transaction.create(answerReference, {
        body,
        likes: 0,
        dislikes: 0,
        author: firestore().collection("userProfiles").doc(userId),
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
      } as FirestoreAnswerInput);

      return answerReference;
    }
  );

  return deserializeAnswer(
    (await answerReference.get()) as firestore.DocumentSnapshot<FirestoreAnswer>
  );
};

function validateBody(body: string): asserts body is AnswerBody {
  try {
    assertAnswerBody(body, "body");
  } catch (error) {
    throw new UserInputError(error.message);
  }
}
