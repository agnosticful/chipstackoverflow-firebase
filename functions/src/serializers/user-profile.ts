import { firestore } from "firebase-admin";
import { FirestoreUserProfile } from "../models/firestore/user-profile";
import { UserProfile } from "../models/user-profile";

export function deserializeUserProfile(
  snapshot: firestore.DocumentSnapshot<FirestoreUserProfile>
): UserProfile {
  return {
    id: snapshot.id,
    name: snapshot.data()!.name,
    imageURL: new URL(snapshot.data()!.imageURL),
  };
}
