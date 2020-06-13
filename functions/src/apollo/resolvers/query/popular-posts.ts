import { firestore } from "firebase-admin";
import { FirestorePost } from "../../../models/firestore/post";
import { Post } from "../../../models/post";
import { deserializePost } from "../../../serializers/post";
import { Context } from "../../context";

export default async (_: any, __: {}, ___: Context): Promise<Post[]> => {
  const snapshot = (await firestore()
    .collection("posts")
    .orderBy("likes", "desc")
    .limit(20)
    .get()) as firestore.QuerySnapshot<FirestorePost>;

  return snapshot.docs.map((doc) => deserializePost(doc));
};
