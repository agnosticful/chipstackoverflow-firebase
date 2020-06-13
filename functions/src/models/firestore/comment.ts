import { firestore } from "firebase-admin";
import { CommentBody } from "../comment";
import { FirestoreUserProfile } from "./user-profile";

export interface FirestoreComment {
  readonly body: CommentBody;
  readonly likes: number;
  readonly dislikes: number;
  readonly author: firestore.DocumentReference<FirestoreUserProfile>;
  readonly createdAt: firestore.Timestamp;
  readonly lastUpdatedAt: firestore.Timestamp;
}

export interface FirestoreCommentInput
  extends Omit<
    FirestoreComment,
    "likes" | "dislikes" | "createdAt" | "lastUpdatedAt"
  > {
  readonly likes: 0;
  readonly dislikes: 0;
  readonly createdAt: firestore.FieldValue;
  readonly lastUpdatedAt: firestore.FieldValue;
}
