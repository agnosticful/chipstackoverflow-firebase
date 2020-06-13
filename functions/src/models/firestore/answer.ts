import { firestore } from "firebase-admin";
import { AnswerBody } from "../answer";
import { FirestoreUserProfile } from "./user-profile";

export interface FirestoreAnswer {
  readonly body: AnswerBody;
  readonly likes: number;
  readonly dislikes: number;
  readonly author: firestore.DocumentReference<FirestoreUserProfile>;
  readonly createdAt: firestore.Timestamp;
  readonly lastUpdatedAt: firestore.Timestamp;
}

export interface FirestoreAnswerInput
  extends Omit<
    FirestoreAnswer,
    "likes" | "dislikes" | "createdAt" | "lastUpdatedAt"
  > {
  readonly likes: 0;
  readonly dislikes: 0;
  readonly createdAt: firestore.FieldValue;
  readonly lastUpdatedAt: firestore.FieldValue;
}
