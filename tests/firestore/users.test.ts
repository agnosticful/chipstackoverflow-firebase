import {
  assertSucceeds,
  clearFirestoreData,
  initializeAdminApp,
  initializeTestApp
} from "@firebase/testing";

const admin = initializeAdminApp({ projectId: "my-test-project" });
const app = initializeTestApp({
  projectId: "my-test-project",
  auth: { uid: "loremipsum", email: "alice@example.com" }
});

describe("GET /users/{userId}", () => {
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
          .doc()
          .get()
      )
    ).resolves.toBeDefined();
  });
});

describe("LIST /users/{userId}", () => {
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

describe("UPDATE /users/{userId}", () => {
  const profileImageURL =
    "https://firebasestorage.googleapis.com/v0/b/chipstackoverflow.appspot.com/o/user_profile_images%2abc.png?alt=media&token=dummy";

  beforeEach(async () => {
    await admin
      .firestore()
      .collection("users")
      .doc("loremipsum")
      .set({
        name: "Kohei",
        profileImageURL
      });
  });

  afterEach(async () => {
    await clearFirestoreData({
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
            profileImageURL
          })
      )
    ).resolves.toBeUndefined();
  });

  it("is not allowed to change profileImageURL", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc("loremipsum")
          .update({
            name: "Koh",
            profileImageURL:
              "https://firebasestorage.googleapis.com/v0/b/chipstackoverflow.appspot.com/o/user_profile_images%2def.png?alt=media&token=dummy"
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
          .doc()
          .update({
            name: "Rio",
            profileImageURL:
              "https://firebasestorage.googleapis.com/v0/b/chipstackoverflow.appspot.com/o/user_profile_images%2Ffoobar.png?alt=media&token=dummy"
          })
      )
    ).rejects.toThrow();
  });
});
