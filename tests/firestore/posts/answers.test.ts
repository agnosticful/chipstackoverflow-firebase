import {
  assertSucceeds,
  clearFirestoreData,
  initializeTestApp
} from "@firebase/testing";

const projectId = "sgzcjzunovgcnbxf";
const uid = "jjyiidzgqwcvprff";
const app = initializeTestApp({ projectId, auth: { uid } });

describe("GET /posts/{postId}/answers/{answerId}", () => {
  it("is allowed in anyway", async () => {
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
  it("is allowed in anyway", async () => {
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

  it("is allowed as long as the data is valid", async () => {
    await expect(
      assertSucceeds(
        postRef.collection("answers").add({
          post: postRef,
          user: userRef,
          body:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          likes: 0,
          dislikes: 0
        })
      )
    ).resolves.toBeDefined();
  });

  it("is disallowed if `post` doesn't point the post (parent)", async () => {
    await expect(
      assertSucceeds(
        postRef.collection("answers").add({
          post: app
            .firestore()
            .collection("posts")
            .doc(),
          user: userRef,
          body:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          likes: 0,
          dislikes: 0
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed if `user` doesn't point the request user", async () => {
    await expect(
      assertSucceeds(
        postRef.collection("answers").add({
          post: postRef,
          user: app
            .firestore()
            .collection("users")
            .doc(),
          body:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          likes: 0,
          dislikes: 0
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed if `body` is empty", async () => {
    await expect(
      assertSucceeds(
        postRef.collection("answers").add({
          post: postRef,
          user: userRef,
          body: "",
          likes: 0,
          dislikes: 0
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed if `likes` is not zero", async () => {
    for (const likes of [-1, 1, 0.01]) {
      await expect(
        assertSucceeds(
          postRef.collection("answers").add({
            post: postRef,
            user: userRef,
            body: "",
            likes,
            dislikes: 0
          })
        )
      ).rejects.toThrow();
    }
  });

  it("is disallowed if `dislikes` is not zero", async () => {
    for (const dislikes of [-1, 1, 0.01]) {
      await expect(
        assertSucceeds(
          postRef.collection("answers").add({
            post: postRef,
            user: userRef,
            body: "",
            likes: 0,
            dislikes
          })
        )
      ).rejects.toThrow();
    }
  });
});
