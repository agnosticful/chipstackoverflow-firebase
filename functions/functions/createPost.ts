import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";
import assertGameSituation from "../assertions/assertGameSituation";
import assertObject from "../assertions/assertObject";
import assertPostBody from "../assertions/assertPostBody";
import assertPostTitle from "../assertions/assertPostTitle";
import firebaseAdminApp from "../firebaseAdminApp";

export default functions.https.onCall(async (data, { auth }) => {
  if (!auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "you need to be authenticated to create a post."
    );
  }

  try {
    assertObject<"title" | "body" | "gameSituation">(data, "The data");
  } catch (err) {
    throw new functions.https.HttpsError("invalid-argument", err.message);
  }

  const { title, body, gameSituation } = data;

  try {
    assertPostTitle(title, "title");
    assertPostBody(body, "body");
    assertGameSituation(gameSituation, "gameSituation");
  } catch (err) {
    throw new functions.https.HttpsError("invalid-argument", err.message);
  }

  const ref = await firebaseAdminApp
    .firestore()
    .collection("posts")
    .add({
      title,
      body,
      totalLikes: 0,
      totalDislikes: 0,
      gameSituation,
      user: firebaseAdminApp.firestore().collection("users").doc(auth.uid),
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
    });

  return ref.id;
});
