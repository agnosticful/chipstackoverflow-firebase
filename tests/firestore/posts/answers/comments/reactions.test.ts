import {
  assertSucceeds,
  clearFirestoreData,
  initializeAdminApp,
  initializeTestApp,
} from "@firebase/testing";
import * as faker from "faker";

const projectId = faker.random.alphaNumeric(16);
const uid = faker.random.alphaNumeric(16);
const adminApp = initializeAdminApp({ projectId });
const app = initializeTestApp({ projectId, auth: { uid } });

describe("LIST /posts/{postId}/answers/{answerId}/comments/{commentId}/reactions/{reactionId}", () => {
  it("is disallowed to get reactions basically", async () => {
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
          .collection("reactions")
          .get()
      )
    ).rejects.toThrow();
  });

  it("is allowed to get only reactions the user created", async () => {
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
          .collection("reactions")
          .where("user", "==", app.firestore().collection("users").doc(uid))
          .get()
      )
    ).resolves.toBeDefined();
  });
});

describe("CREATE /posts/{postId}/answers/{answerId}/comments/{commentId}/reactions/{reactionId}", () => {
  const user = app.firestore().collection("users").doc(uid);
  const post = app.firestore().collection("posts").doc();
  const answer = post.collection("answers").doc();
  const comment = answer.collection("comments").doc();

  beforeEach(async () => {
    await adminApp
      .firestore()
      .collection("posts")
      .doc(post.id)
      .collection("answers")
      .doc(answer.id)
      .collection("comments")
      .doc(comment.id)
      .set({ dummy: true });
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId });
  });

  it("is allowed to create a like to a comment", async () => {
    await expect(
      assertSucceeds(
        comment.collection("reactions").doc(uid).set({
          user,
          type: "LIKE",
        })
      )
    ).resolves.toBeUndefined();
  });

  it("is allowed to create a dislike to a comment", async () => {
    await expect(
      assertSucceeds(
        comment.collection("reactions").doc(uid).set({
          user,
          type: "DISLIKE",
        })
      )
    ).resolves.toBeUndefined();
  });

  it("is disallowed to create a like to a non-existing comment", async () => {
    await adminApp
      .firestore()
      .collection("posts")
      .doc(post.id)
      .collection("answers")
      .doc(answer.id)
      .collection("comments")
      .doc(comment.id)
      .delete();

    await expect(
      assertSucceeds(
        comment.collection("reactions").doc(uid).set({
          user,
          type: "LIKE",
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create a dislike to a non-existing comment", async () => {
    await adminApp
      .firestore()
      .collection("posts")
      .doc(post.id)
      .collection("answers")
      .doc(answer.id)
      .collection("comments")
      .doc(comment.id)
      .delete();

    await expect(
      assertSucceeds(
        comment.collection("reactions").doc(uid).set({
          user,
          type: "DISLIKE",
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create with id that is not the user's ID", async () => {
    await expect(
      assertSucceeds(
        comment.collection("reactions").doc().set({
          user,
          type: "LIKE",
        })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create a like or dislike as someone else", async () => {
    await expect(
      assertSucceeds(
        comment
          .collection("reactions")
          .doc(uid)
          .set({
            user: app.firestore().collection("users").doc(),
            type: "LIKE",
          })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to create with invalid `type`", async () => {
    await expect(
      assertSucceeds(
        comment.collection("reactions").doc(uid).set({
          user,
          type: "LIKEY",
        })
      )
    ).rejects.toThrow();
  });
});

describe("DELETE /posts/{postId}/answers/{answerId}/comments/{commentId}/reactions/{reactionId}", () => {
  const postId = faker.random.alphaNumeric(16);
  const answerId = faker.random.alphaNumeric(16);
  const commentId = faker.random.alphaNumeric(16);

  beforeEach(async () => {
    await adminApp
      .firestore()
      .collection("posts")
      .doc(postId)
      .collection("answers")
      .doc(answerId)
      .collection("comments")
      .doc(commentId)
      .collection("reactions")
      .doc(uid)
      .set({
        answer: adminApp
          .firestore()
          .collection("posts")
          .doc(postId)
          .collection("answers")
          .doc(answerId)
          .collection("comments")
          .doc(commentId),
        user: adminApp.firestore().collection("users").doc(uid),
        type: "LIKE",
      });

    await adminApp
      .firestore()
      .collection("posts")
      .doc(postId)
      .collection("answers")
      .doc(answerId)
      .collection("comments")
      .doc(commentId)
      .collection("reactions")
      .doc("aewnhvlkhjkvripg")
      .set({
        answer: adminApp
          .firestore()
          .collection("posts")
          .doc(postId)
          .collection("answers")
          .doc(answerId)
          .collection("comments")
          .doc(commentId),
        user: adminApp.firestore().collection("users").doc("aewnhvlkhjkvripg"),
        type: "LIKE",
      });
  });

  it("is allowed to delete a like or dislike the user created", async () => {
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
          .collection("reactions")
          .doc(uid)
          .delete()
      )
    ).resolves.toBeUndefined();
  });

  it("is disallowed to delete likes or dislikes someone created", async () => {
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
          .collection("reactions")
          .doc("aewnhvlkhjkvripg")
          .delete()
      )
    ).rejects.toThrow();
  });
});
