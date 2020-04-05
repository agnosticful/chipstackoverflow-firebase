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

describe("GET /posts/{postId}/answers/{answerId}", () => {
  it("is allowed to get an answer in anyway", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("posts")
          .doc()
          .collection("answers")
          .doc()
          .get()
      )
    ).resolves.toBeDefined();
  });
});

describe("LIST /posts/{postId}/answers/{answerId}", () => {
  it("is allowed to get answers in anyway", async () => {
    await expect(
      assertSucceeds(
        app.firestore().collection("posts").doc().collection("answers").get()
      )
    ).resolves.toBeDefined();
  });
});

describe("CREATE /posts/{postId}/answers/{answerId}", () => {
  const user = app.firestore().collection("users").doc(uid);
  const post = app.firestore().collection("posts").doc();

  beforeEach(async () => {
    await adminApp
      .firestore()
      .collection("posts")
      .doc(post.id)
      .set({ dummy: true });
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId });
  });

  it("is allowed to create an answer as long as the data is valid", async () => {
    await expect(
      assertSucceeds(
        post.collection("answers").add({
          user,
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).resolves.toBeDefined();
  });

  it("is disallowed to create an answer that the post (parent document) is not exists", async () => {
    await adminApp.firestore().collection("posts").doc(post.id).delete();

    await expect(
      assertSucceeds(
        post.collection("answers").add({
          user,
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create an answer that its `user` doesn't point the request user", async () => {
    await expect(
      assertSucceeds(
        post.collection("answers").add({
          user: app.firestore().collection("users").doc(),
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create an answer with empty body", async () => {
    await expect(
      assertSucceeds(
        post.collection("answers").add({
          user,
          body: "",
          likes: 0,
          dislikes: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create an answer with non-zero `likes`", async () => {
    await expect(
      assertSucceeds(
        post.collection("answers").add({
          user,
          body: faker.lorem.sentence(),
          likes: 1,
          dislikes: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create an answer with non-zero `dislikes`", async () => {
    await expect(
      assertSucceeds(
        post.collection("answers").add({
          user,
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 1,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create an answer with `createdAt` that is not server timestamp", async () => {
    await expect(
      assertSucceeds(
        post.collection("answers").add({
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
        post.collection("answers").add({
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
