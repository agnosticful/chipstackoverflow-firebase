import {
  assertSucceeds,
  clearFirestoreData,
  initializeAdminApp,
  initializeTestApp
} from "@firebase/testing";

const projectId = "qsdfzxikwkvwmihx";
const uid = "xaivfmsmfkqbeemi";
const admin = initializeAdminApp({ projectId });
const app = initializeTestApp({ projectId, auth: { uid } });

describe("GET /users/{userId}/reactions/{reactionId}", () => {
  it("is allowed accessing my ones", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("reactions")
          .doc()
          .get()
      )
    ).resolves.toBeDefined();
  });

  it("is not allowed accessing anyone's else", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc()
          .collection("reactions")
          .doc()
          .get()
      )
    ).rejects.toThrow();
  });
});

describe("LIST /users/{userId}/reactions/{reactionId}", () => {
  it("is allowed accessing my ones", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("reactions")
          .get()
      )
    ).resolves.toBeDefined();
  });

  it("is not allowed accessing anyone's else", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc()
          .collection("reactions")
          .get()
      )
    ).rejects.toThrow();
  });
});

describe("CREATE /users/{userId}/reactions/{reactionId}", () => {
  beforeEach(async () => {
    await admin
      .firestore()
      .collection("posts")
      .doc("dummypostid")
      .set({});

    await admin
      .firestore()
      .collection("posts")
      .doc("dummypostid")
      .collection("answers")
      .doc("dummyanswerid")
      .set({});

    await admin
      .firestore()
      .collection("posts")
      .doc("dummypostid")
      .collection("comments")
      .doc("dummycommentid")
      .set({});
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId });
  });

  it("is allowed to create a like for an answer", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("reactions")
          .doc()
          .set({
            to: app
              .firestore()
              .collection("posts")
              .doc("dummypostid")
              .collection("answers")
              .doc("dummyanswerid"),
            type: "LIKE"
          })
      )
    ).resolves.toBeUndefined();
  });

  it("is allowed to create a dislike for an answer", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("reactions")
          .doc()
          .set({
            to: app
              .firestore()
              .collection("posts")
              .doc("dummypostid")
              .collection("answers")
              .doc("dummyanswerid"),
            type: "DISLIKE"
          })
      )
    ).resolves.toBeUndefined();
  });

  it("is allowed to create a like for a comment", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("reactions")
          .doc()
          .set({
            to: app
              .firestore()
              .collection("posts")
              .doc("dummypostid")
              .collection("comments")
              .doc("dummycommentid"),
            type: "LIKE"
          })
      )
    ).resolves.toBeUndefined();
  });

  it("is allowed to create a dislike for a comment", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("reactions")
          .doc()
          .set({
            to: app
              .firestore()
              .collection("posts")
              .doc("dummypostid")
              .collection("comments")
              .doc("dummycommentid"),
            type: "DISLIKE"
          })
      )
    ).resolves.toBeUndefined();
  });

  it("is not allowed to create with invalid type", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("reactions")
          .doc()
          .set({
            to: app
              .firestore()
              .collection("posts")
              .doc("dummypostid")
              .collection("answers")
              .doc("dummyanswerid"),
            type: "LIKEY"
          })
      )
    ).rejects.toThrow();
  });

  it("is not allowed to create a like or dislike for a non-existing answer", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("reactions")
          .doc()
          .set({
            to: app
              .firestore()
              .collection("posts")
              .doc("dummypostid")
              .collection("answers")
              .doc(),
            type: "LIKE"
          })
      )
    ).rejects.toThrow();
  });

  it("is not allowed to create a like or dislike for a non-existing comment", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("reactions")
          .doc()
          .set({
            to: app
              .firestore()
              .collection("posts")
              .doc("dummypostid")
              .collection("answers")
              .doc("dummyanswerid")
              .collection("comments")
              .doc(),
            type: "LIKE"
          })
      )
    ).rejects.toThrow();
  });

  it("is not allowed to create a like or dislike for not answers or comments", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("reactions")
          .doc()
          .set({
            to: app
              .firestore()
              .collection("posts")
              .doc("dummypostid")
              .collection("answeria")
              .doc(),
            type: "LIKE"
          })
      )
    ).rejects.toThrow();
  });

  it("is not allowed to create a like or dislike if  for not answers or comments", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("reactions")
          .doc()
          .set({
            to: app
              .firestore()
              .collection("posts")
              .doc("dummypostid")
              .collection("answer")
              .doc(),
            type: "LIKE"
          })
      )
    ).rejects.toThrow();
  });

  it("is not allowed to create a like or dislike in anyone else", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc()
          .collection("reactions")
          .doc()
          .set({
            to: app
              .firestore()
              .collection("posts")
              .doc("dummypostid")
              .collection("comments")
              .doc("dummycommentid"),
            type: "LIKE"
          })
      )
    ).rejects.toThrow();
  });
});

describe("DELETE /users/{userId}/reactions/{reactionId}", () => {
  it("is allowed to delete my like or dislike", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("reactions")
          .doc()
          .delete()
      )
    ).resolves.toBeUndefined();
  });

  it("is allowed to delete someone's like or dislike", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc()
          .collection("reactions")
          .doc()
          .delete()
      )
    ).rejects.toThrow();
  });
});
