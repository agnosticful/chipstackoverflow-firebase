import {
  assertSucceeds,
  clearFirestoreData,
  initializeAdminApp,
  initializeTestApp
} from "@firebase/testing";

describe("/users/{userId}", () => {
  const admin = initializeAdminApp({ projectId: "my-test-project" });
  const app = initializeTestApp({
    projectId: "my-test-project",
    auth: { uid: "loremipsum", email: "alice@example.com" }
  });

  describe("get method", () => {
    it("is allowed accessing myself", async () => {
      await expect(
        assertSucceeds(
          app
            .firestore()
            .collection("users")
            .doc("loremipsum")
            .get()
        )
      ).resolves.toBeDefined();
    });

    it("is allowed accessing anyone else", async () => {
      await expect(
        assertSucceeds(
          app
            .firestore()
            .collection("users")
            .doc("foobar")
            .get()
        )
      ).resolves.toBeDefined();
    });
  });

  describe("list method", () => {
    it("is allowed anyway", async () => {
      await expect(
        assertSucceeds(
          app
            .firestore()
            .collection("users")
            .limit(10)
            .get()
        )
      ).resolves.toBeDefined();
    });
  });

  describe("update method", () => {
    beforeEach(async () => {
      await admin
        .firestore()
        .collection("users")
        .doc("loremipsum")
        .set({
          name: "Kohei",
          profileImageURL: "https://example.com/"
        });

      await admin
        .firestore()
        .collection("users")
        .doc("foobar")
        .set({
          name: "Ryo",
          profileImageURL: "https://example.com/"
        });
    });

    afterEach(() => {
      clearFirestoreData({
        projectId: "my-test-project"
      });
    });

    it("is allowed to update myself", async () => {
      await expect(
        assertSucceeds(
          app
            .firestore()
            .collection("users")
            .doc("loremipsum")
            .update({
              name: "Koh",
              profileImageURL:
                "https://firebasestorage.googleapis.com/v0/b/chipstackoverflow.appspot.com/o/user_profile_images%2Floremipsum.png?alt=media&token=dummy"
            })
        )
      ).resolves.toBeUndefined();
    });

    it("is not allowed to update if the given profileImageURL is invalid", async () => {
      await expect(
        assertSucceeds(
          app
            .firestore()
            .collection("users")
            .doc("loremipsum")
            .update({
              name: "Koh",
              profileImageURL: "https://example.com/something.png"
            })
        )
      ).rejects.toThrow();
    });

    it("is not allowed to update anyone else", async () => {
      await expect(
        assertSucceeds(
          app
            .firestore()
            .collection("users")
            .doc("foobar")
            .update({
              name: "Rio",
              profileImageURL:
                "https://firebasestorage.googleapis.com/v0/b/chipstackoverflow.appspot.com/o/user_profile_images%2Ffoobar.png?alt=media&token=dummy"
            })
        )
      ).rejects.toThrow();
    });
  });
});