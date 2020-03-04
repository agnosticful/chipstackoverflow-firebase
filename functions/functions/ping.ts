import * as functions from "firebase-functions";

export default functions.https.onCall(() => {
  return "pong";
});
