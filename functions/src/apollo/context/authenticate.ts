import { auth } from "firebase-admin";
import * as functions from "firebase-functions";
import { Context } from ".";
import { UserInputError } from "apollo-server-core";

export default async (
  request: functions.https.Request,
  context: Context
): Promise<any> => {
  if (request.headers.authorization) {
    if (!request.headers.authorization.startsWith("Bearer ")) {
      throw new UserInputError(
        "This API only allows Bearer Auth Token. You should set authorization: Bearer xxxxxx if you want to authenticate."
      );
    }

    const token = request.headers.authorization.substring(7);
    let decodedToken: auth.DecodedIdToken;

    try {
      decodedToken = await auth().verifyIdToken(token);
    } catch (err) {
      return context;
    }

    return { ...context, userId: decodedToken.uid };
  }

  return context;
};
