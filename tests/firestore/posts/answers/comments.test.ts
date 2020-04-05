import {
  assertSucceeds,
  clearFirestoreData,
  firestore,
  initializeAdminApp,
  initializeTestApp,
} from "@firebase/testing";
import * as faker from "faker";

const projectId = faker.random.alphaNumeric(16);
const uid = faker.random.alphaNumeric(16);
const adminApp = initializeAdminApp({ projectId });
const app = initializeTestApp({ projectId, auth: { uid } });

describe("GET /posts/{postId}/answers/{answerId}/comments/{commentId}", () => {
  it("is allowed to get a comment in anyway", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("posts")
          .doc()
          .collection("answers")
          .doc()
          .collection("comments")
          .doc()
          .get()
      )
    ).resolves.toBeDefined();
  });
});

describe("LIST /posts/{postId}/answers/{answerId}/comments/{commentId}", () => {
  it("is allowed to get comments in anyway", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("posts")
          .doc()
          .collection("answers")
          .doc()
          .collection("comments")
          .get()
      )
    ).resolves.toBeDefined();
  });
});

describe("CREATE /posts/{postId}/answers/{answerId}/comments/{commentId}", () => {
  const user = app.firestore().collection("users").doc(uid);
  const post = app.firestore().collection("posts").doc();
  const answer = post.collection("answers").doc();

  beforeEach(async () => {
    await adminApp
      .firestore()
      .collection("posts")
      .doc(post.id)
      .collection("answers")
      .doc(answer.id)
      .set({});
  });

  afterEach(async () => {
    clearFirestoreData({ projectId });
  });

  it("is allowed to create a comment in right way", async () => {
    await expect(
      assertSucceeds(
        answer.collection("comments").add({
          user,
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).resolves.toBeDefined();
  });

  it("is disallowed to create a comment that the answer (parent document) is not exists", async () => {
    await adminApp
      .firestore()
      .collection("posts")
      .doc(post.id)
      .collection("answers")
      .doc(answer.id)
      .delete();

    await expect(
      assertSucceeds(
        answer.collection("comments").add({
          user,
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create a comment with `user` that doesn't point the requster", async () => {
    await expect(
      assertSucceeds(
        answer.collection("comments").add({
          user: app.firestore().collection("users").doc(),
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create a comment with empty body", async () => {
    await expect(
      assertSucceeds(
        answer.collection("comments").add({
          user,
          body: "",
          likes: 0,
          dislikes: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create a comment with non-zero likes", async () => {
    await expect(
      assertSucceeds(
        answer.collection("comments").add({
          user,
          body: faker.lorem.sentence(),
          likes: 1,
          dislikes: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create a comment with non-zero dislikes", async () => {
    await expect(
      assertSucceeds(
        answer.collection("comments").add({
          user,
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 1,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create a comment with `createdAt` that is not server timestamp", async () => {
    await expect(
      assertSucceeds(
        answer.collection("comments").add({
          user,
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 1,
          createdAt: firestore.Timestamp.fromMillis(Date.now() - 1),
        })
      )
    ).rejects.toThrow();

    await expect(
      assertSucceeds(
        answer.collection("comments").add({
          user,
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 1,
          createdAt: firestore.Timestamp.fromMillis(Date.now() + 1),
        })
      )
    ).rejects.toThrow();
  });
});
