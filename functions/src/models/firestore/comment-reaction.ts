import { firestore } from "firebase-admin";
import { FirestoreReactionType } from "./reaction";
import { FirestoreUserProfile } from "./user-profile";

export interface FirestoreCommentReaction {
  readonly type: FirestoreReactionType;
  readonly author: firestore.DocumentReference<FirestoreUserProfile>;
  readonly createdAt: firestore.Timestamp;
}

export interface FirestoreCommentReactionInput
  extends Omit<FirestoreCommentReaction, "createdAt"> {
  readonly createdAt: firestore.FieldValue;
}
