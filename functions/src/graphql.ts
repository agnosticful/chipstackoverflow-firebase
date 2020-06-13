import { apps, initializeApp } from "firebase-admin";
import * as functions from "firebase-functions";
import apolloServer from "./apollo";

if (apps.length === 0) {
  initializeApp();
}

export default functions.https.onRequest(
  apolloServer.createHandler({
    cors: {
      origin: "*",
      credentials: true,
    },
  })
);
