import { firestore } from "firebase-admin";
import { AnswerReaction } from "../models/answer-reaction";
import { FirestoreAnswerReaction } from "../models/firestore/answer-reaction";
import { deserializeReactionType } from "./reaction";

export function deserializeAnswerReaction(
  snapshot: firestore.DocumentSnapshot<FirestoreAnswerReaction>
): AnswerReaction {
  return {
    id: snapshot.id,
    type: deserializeReactionType(snapshot.data()!.type),
    authorId: snapshot.data()!.author.id,
    createdAt: snapshot.data()!.createdAt.toDate(),
  };
}
