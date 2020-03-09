import {
  assertSucceeds,
  clearFirestoreData,
  initializeTestApp
} from "@firebase/testing";
import * as faker from "faker";

const projectId = faker.random.alphaNumeric(16);
const uid = faker.random.alphaNumeric(16);
const app = initializeTestApp({ projectId, auth: { uid } });

describe("CREATE /posts/{postId}/answers/{answerId}/comments/{commentId}", () => {
  const postId = faker.random.alphaNumeric(16);
  const answerId = faker.random.alphaNumeric(16);
  const commentId = faker.random.alphaNumeric(16);

  afterEach(async () => {
    clearFirestoreData({ projectId });
  });

  it("is allowed to create a comment in right way", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("posts")
          .doc(postId)
          .collection("answers")
          .doc(answerId)
          .collection("comments")
          .doc(commentId)
          .set({
            answer: app
              .firestore()
              .collection("posts")
              .doc(postId)
              .collection("answers")
              .doc(answerId),
            user: app
              .firestore()
              .collection("users")
              .doc(uid),
            body: faker.lorem.sentence(),
            likes: 0,
            dislikes: 0
          })
      )
    ).resolves.toBeUndefined();
  });

  it("is disallowed to create a comment with `answer` that doesn't point its parent", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("posts")
          .doc(postId)
          .collection("answers")
          .doc(answerId)
          .collection("comments")
          .doc(commentId)
          .set({
            answer: app
              .firestore()
              .collection("posts")
              .doc(postId)
              .collection("answers")
              .doc(),
            user: app
              .firestore()
              .collection("users")
              .doc(uid),
            body: faker.lorem.sentence(),
            likes: 0,
            dislikes: 0
          })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create a comment with `user` that doesn't point the requster", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("posts")
          .doc(postId)
          .collection("answers")
          .doc(answerId)
          .collection("comments")
          .doc(commentId)
          .set({
            answer: app
              .firestore()
              .collection("posts")
              .doc(postId)
              .collection("answers")
              .doc(answerId),
            user: app
              .firestore()
              .collection("users")
              .doc(),
            body: faker.lorem.sentence(),
            likes: 0,
            dislikes: 0
          })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create a comment with empty body", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("posts")
          .doc(postId)
          .collection("answers")
          .doc(answerId)
          .collection("comments")
          .doc(commentId)
          .set({
            answer: app
              .firestore()
              .collection("posts")
              .doc(postId)
              .collection("answers")
              .doc(answerId),
            user: app
              .firestore()
              .collection("users")
              .doc(uid),
            body: "",
            likes: 0,
            dislikes: 0
          })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create a comment with non-zero likes", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("posts")
          .doc(postId)
          .collection("answers")
          .doc(answerId)
          .collection("comments")
          .doc(commentId)
          .set({
            answer: app
              .firestore()
              .collection("posts")
              .doc(postId)
              .collection("answers")
              .doc(answerId),
            user: app
              .firestore()
              .collection("users")
              .doc(uid),
            body: faker.lorem.sentence(),
            likes: 1,
            dislikes: 0
          })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create a comment with non-zero dislikes", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("posts")
          .doc(postId)
          .collection("answers")
          .doc(answerId)
          .collection("comments")
          .doc(commentId)
          .set({
            answer: app
              .firestore()
              .collection("posts")
              .doc(postId)
              .collection("answers")
              .doc(answerId),
            user: app
              .firestore()
              .collection("users")
              .doc(uid),
            body: faker.lorem.sentence(),
            likes: 0,
            dislikes: 1
          })
      )
    ).rejects.toThrow();
  });
});
