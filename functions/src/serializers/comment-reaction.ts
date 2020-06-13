import { firestore } from "firebase-admin";
import { CommentReaction } from "../models/comment-reaction";
import { FirestoreCommentReaction } from "../models/firestore/comment-reaction";
import { deserializeReactionType } from "./reaction";

export function deserializeCommentReaction(
  snapshot: firestore.DocumentSnapshot<FirestoreCommentReaction>
): CommentReaction {
  return {
    id: snapshot.id,
    type: deserializeReactionType(snapshot.data()!.type),
    authorId: snapshot.data()!.author.id,
    createdAt: snapshot.data()!.createdAt.toDate(),
  };
}
