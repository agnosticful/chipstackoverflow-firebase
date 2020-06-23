import { firestore } from "firebase-admin";
import { FirestorePost } from "../../../models/firestore/post";
import { Post } from "../../../models/post";
import { deserializePost } from "../../../serializers/post";
import { Context } from "../../context";

export default async (
  _: any,
  { postId }: { postId: string },
  __: Context
): Promise<Post | null> => {
  const snapshot = (await firestore()
    .collection("posts")
    .doc(postId)
    .get()) as firestore.DocumentSnapshot<FirestorePost>;

  if (!snapshot.exists) {
    return null;
  }

  return deserializePost(snapshot);
};
