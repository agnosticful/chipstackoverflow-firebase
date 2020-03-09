import {
  assertSucceeds,
  clearFirestoreData,
  initializeAdminApp,
  initializeTestApp
} from "@firebase/testing";
import * as faker from "faker";

const projectId = faker.random.alphaNumeric(16);
const uid = faker.random.alphaNumeric(16);
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
  const name = faker.name.firstName();
  const profileImageURL = faker.internet.url();

  beforeEach(async () => {
    await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .set({
        name,
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
            name: faker.name.firstName(),
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
            name,
            profileImageURL: faker.internet.url()
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
            name,
            profileImageURL
          })
      )
    ).rejects.toThrow();
  });
});
