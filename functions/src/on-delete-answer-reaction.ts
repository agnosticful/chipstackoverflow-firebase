import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";
import { FirestoreAnswerReaction } from "./models/firestore/answer-reaction";
import { ReactionType } from "./models/reaction";
import { deserializeAnswerReaction } from "./serializers/answer-reaction";

export default functions.firestore
  .document("posts/{postId}/answers/{answerId}/reactions/{reactionId}")
  .onDelete(async (snapshot) => {
    const answerReference = snapshot.ref.parent.parent!;
    const postReference = answerReference.parent.parent!;
    const reaction = deserializeAnswerReaction(
      snapshot as firestore.DocumentSnapshot<FirestoreAnswerReaction>
    );

    const batch = firestore().batch();

    if (reaction.type === ReactionType.like) {
      batch.update(postReference, "likes", firestore.FieldValue.increment(-1));
      batch.update(
        answerReference,
        "likes",
        firestore.FieldValue.increment(-1)
      );
    } else {
      batch.update(
        postReference,
        "dislikes",
        firestore.FieldValue.increment(-1)
      );
      batch.update(
        answerReference,
        "dislikes",
        firestore.FieldValue.increment(-1)
      );
    }

    await batch.commit();
  });
