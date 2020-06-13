import { AuthenticationError, UserInputError } from "apollo-server-core";
import { firestore } from "firebase-admin";
import { FirestoreUserProfile } from "../../../models/firestore/user-profile";
import { deserializeUserProfile } from "../../../serializers/user-profile";
import { Context } from "../../context";

export default async (_: any, __: {}, { userId }: Context) => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  const snapshot = (await firestore()
    .collection("userProfiles")
    .doc(userId)
    .get()) as firestore.DocumentSnapshot<FirestoreUserProfile>;

  if (!snapshot.exists) {
    throw new UserInputError(`The user (id: ${userId}) does not exist.`);
  }

  return deserializeUserProfile(snapshot);
};
