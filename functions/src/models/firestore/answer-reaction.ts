import { firestore } from "firebase-admin";
import { FirestoreReactionType } from "./reaction";
import { FirestoreUserProfile } from "./user-profile";

export interface FirestoreAnswerReaction {
  readonly type: FirestoreReactionType;
  readonly author: firestore.DocumentReference<FirestoreUserProfile>;
  readonly createdAt: firestore.Timestamp;
}

export interface FirestoreAnswerReactionInput
  extends Omit<FirestoreAnswerReaction, "createdAt"> {
  readonly createdAt: firestore.FieldValue;
}
