import { firestore } from "firebase-admin";
import { Comment } from "../models/comment";
import { FirestoreComment } from "../models/firestore/comment";

export function deserializeComment(
  snapshot: firestore.DocumentSnapshot<FirestoreComment>
): Comment {
  return {
    id: snapshot.id,
    body: snapshot.data()!.body,
    likes: snapshot.data()!.likes,
    dislikes: snapshot.data()!.dislikes,
    authorId: snapshot.data()!.author.id,
    postId: snapshot.ref.parent.parent!.parent.parent!.id,
    answerId: snapshot.ref.parent.parent!.id,
    createdAt: snapshot.data()!.createdAt.toDate(),
    lastUpdatedAt: snapshot.data()!.lastUpdatedAt.toDate(),
  };
}
