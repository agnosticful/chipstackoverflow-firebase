import {
  assertSucceeds,
  clearFirestoreData,
  firestore,
  initializeTestApp,
} from "@firebase/testing";
import * as faker from "faker";

const projectId = faker.random.alphaNumeric(16);
const uid = faker.random.alphaNumeric(16);
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
        app
          .firestore()
          .collection("posts")
          .doc()
          .collection("answers")
          .get()
      )
    ).resolves.toBeDefined();
  });
});

describe("CREATE /posts/{postId}/answers/{answerId}", () => {
  const userRef = app
    .firestore()
    .collection("users")
    .doc(uid);
  const postRef = app
    .firestore()
    .collection("posts")
    .doc();

  afterEach(async () => {
    await clearFirestoreData({ projectId });
  });

  it("is allowed to create an answer as long as the data is valid", async () => {
    await expect(
      assertSucceeds(
        postRef.collection("answers").add({
          post: postRef,
          user: userRef,
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      )
    ).resolves.toBeDefined();
  });

  it("is disallowed to create an answer that its `post` doesn't point the post (parent)", async () => {
    await expect(
      assertSucceeds(
        postRef.collection("answers").add({
          post: app
            .firestore()
            .collection("posts")
            .doc(),
          user: userRef,
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
        postRef.collection("answers").add({
          post: postRef,
          user: app
            .firestore()
            .collection("users")
            .doc(),
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
        postRef.collection("answers").add({
          post: postRef,
          user: userRef,
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
        postRef.collection("answers").add({
          post: postRef,
          user: userRef,
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
        postRef.collection("answers").add({
          post: postRef,
          user: userRef,
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
        postRef.collection("answers").add({
          post: postRef,
          user: userRef,
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 1,
          createdAt: firestore.Timestamp.fromMillis(Date.now() - 1),
        })
      )
    ).rejects.toThrow();

    await expect(
      assertSucceeds(
        postRef.collection("answers").add({
          post: postRef,
          user: userRef,
          body: faker.lorem.sentence(),
          likes: 0,
          dislikes: 1,
          createdAt: firestore.Timestamp.fromMillis(Date.now() + 1),
        })
      )
    ).rejects.toThrow();
  });
});
