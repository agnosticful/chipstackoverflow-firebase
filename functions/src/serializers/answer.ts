import { firestore } from "firebase-admin";
import { Answer } from "../models/answer";
import { FirestoreAnswer } from "../models/firestore/answer";

export function deserializeAnswer(
  snapshot: firestore.DocumentSnapshot<FirestoreAnswer>
): Answer {
  return {
    id: snapshot.id,
    body: snapshot.data()!.body,
    likes: snapshot.data()!.likes,
    dislikes: snapshot.data()!.dislikes,
    authorId: snapshot.data()!.author.id,
    postId: snapshot.ref.parent.parent!.id,
    createdAt: snapshot.data()!.createdAt.toDate(),
    lastUpdatedAt: snapshot.data()!.lastUpdatedAt.toDate(),
  };
}
