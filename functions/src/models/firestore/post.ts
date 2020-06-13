import { firestore } from "firebase-admin";
import { FirestoreUserProfile } from "./user-profile";
import { PostBody, PostTitle } from "../post";

export interface FirestorePost {
  readonly title: PostTitle;
  readonly body: PostBody;
  readonly gameType: FirestoreGameType;
  readonly playerLength: number;
  readonly playerStackSizes: number[];
  readonly playerCards: (FirestorePlayingCards | null)[];
  readonly communityCards: FirestorePlayingCards;
  readonly heroIndex: number;
  readonly smallBlindSize: number;
  readonly antiSize: number;
  readonly preflopActions: FirestoreStreetAction[];
  readonly flopActions: FirestoreStreetAction[];
  readonly turnActions: FirestoreStreetAction[];
  readonly riverActions: FirestoreStreetAction[];
  readonly likes: number;
  readonly dislikes: number;
  readonly author: firestore.DocumentReference<FirestoreUserProfile>;
  readonly createdAt: firestore.Timestamp;
  readonly lastUpdatedAt: firestore.Timestamp;
}

export interface FirestorePostInput
  extends Omit<
    FirestorePost,
    "likes" | "dislikes" | "createdAt" | "lastUpdatedAt"
  > {
  readonly likes: 0;
  readonly dislikes: 0;
  readonly createdAt: firestore.FieldValue;
  readonly lastUpdatedAt: firestore.FieldValue;
}

// ([A2-9TJQK][shdc])*
export type FirestorePlayingCards = string;

export type FirestoreGameType = "CASH" | "TOURNAMENT";

export interface FirestoreStreetAction {
  type: FirestoreStreetActionType;
  playerIndex: number;
  betSize: number;
}

export type FirestoreStreetActionType =
  | "FOLD"
  | "CHECK"
  | "CALL"
  | "BET"
  | "RAISE";
