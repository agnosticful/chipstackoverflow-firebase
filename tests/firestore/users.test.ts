import {
  assertSucceeds,
  clearFirestoreData,
  initializeAdminApp,
  initializeTestApp
} from "@firebase/testing";

const projectId = "uidnvmmzskggydzy";
const uid = "bsgjxvlbbchfapiw";
const admin = initializeAdminApp({ projectId });
const app = initializeTestApp({ projectId, auth: { uid } });

describe("GET /users/{userId}", () => {
  it("is allowed to get my one", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .get()
      )
    ).resolves.toBeDefined();
  });

  it("is allowed to get anyone's else", async () => {
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
      .doc(uid)
      .set({
        name: "Kohei",
        profileImageURL
      });
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId });
  });

  it("is allowed to update myself", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .update({
            name: "Koh",
            profileImageURL
          })
      )
    ).resolves.toBeUndefined();
  });

  it("is disallowed to change profileImageURL", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("users")
          .doc(uid)
          .update({
            name: "Koh",
            profileImageURL:
              "https://firebasestorage.googleapis.com/v0/b/chipstackoverflow.appspot.com/o/user_profile_images%2def.png?alt=media&token=dummy"
          })
      )
    ).rejects.toThrow();
  });

  it("is disallowed to update anyone else", async () => {
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
