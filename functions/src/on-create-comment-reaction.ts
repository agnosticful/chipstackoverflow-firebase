import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";
import { FirestoreCommentReaction } from "./models/firestore/comment-reaction";
import { ReactionType } from "./models/reaction";
import { deserializeCommentReaction } from "./serializers/comment-reaction";

export default functions.firestore
  .document(
    "posts/{postId}/answers/{answerId}/comments/{commentId}/reactions/{reactionId}"
  )
  .onCreate(async (snapshot) => {
    const commentReference = snapshot.ref.parent.parent!;
    const answerReference = commentReference.parent.parent!;
    const postReference = answerReference.parent.parent!.parent.parent!;
    const reaction = deserializeCommentReaction(
      snapshot as firestore.DocumentSnapshot<FirestoreCommentReaction>
    );

    const batch = firestore().batch();

    if (reaction.type === ReactionType.like) {
      batch.update(postReference, "likes", firestore.FieldValue.increment(1));
      batch.update(
        commentReference,
        "likes",
        firestore.FieldValue.increment(1)
      );
    } else {
      batch.update(
        postReference,
        "dislikes",
        firestore.FieldValue.increment(1)
      );
      batch.update(
        commentReference,
        "dislikes",
        firestore.FieldValue.increment(1)
      );
    }

    await batch.commit();
  });
