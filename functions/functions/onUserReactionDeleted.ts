import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";
import app from "../firebaseAdminApp";

export default functions.firestore
  .document("users/{userId}/reactions/{reactionId}")
  .onDelete(async snapshot => {
    const answerOrCommentRef: firestore.DocumentReference = snapshot.data()!.to;
    const type: "LIKE" | "DISLIKE" = snapshot.data()!.type;

    await app.firestore().runTransaction(async transaction => {
      const firstDuplication = await transaction.get(
        answerOrCommentRef
          .collection("reactions")
          .where("to", "==", snapshot.ref)
          .limit(1)
      );

      if (firstDuplication.empty) return;

      const answerOrCommentSnapshot = await transaction.get(answerOrCommentRef);
      const answerOrComment = answerOrCommentSnapshot.data()!;

      transaction
        .delete(firstDuplication.docs[0].ref)
        .update(answerOrCommentRef, {
          ...answerOrComment,
          ...(type === "LIKE"
            ? { likes: answerOrComment.likes - 1 }
            : { dislikes: answerOrComment.dislikes - 1 })
        });
    });
  });
