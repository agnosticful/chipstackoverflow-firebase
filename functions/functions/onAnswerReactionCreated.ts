import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";
import app from "../firebaseAdminApp";

export default functions.firestore
  .document("posts/{postId}/answers/{answerId}/reactions/{reactionId}")
  .onCreate(async (snapshot, { params }) => {
    const type: "LIKE" | "DISLIKE" = snapshot.data()!.type;

    await app
      .firestore()
      .collection("posts")
      .doc(params.postId)
      .collection("answers")
      .doc(params.answerId)
      .update(
        type === "LIKE"
          ? { likes: firestore.FieldValue.increment(1) }
          : { dislikes: firestore.FieldValue.increment(1) }
      );
  });
