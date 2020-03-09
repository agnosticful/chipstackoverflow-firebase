import { assertSucceeds, initializeTestApp } from "@firebase/testing";
import * as faker from "faker";

const projectId = faker.random.alphaNumeric(16);
const uid = faker.random.alphaNumeric(16);
const app = initializeTestApp({ projectId, auth: { uid } });

describe("GET /posts/{postId}", () => {
  it("is allowed to get a comment in anyway", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("posts")
          .doc()
          .get()
      )
    ).resolves.toBeDefined();
  });
});

describe("LIST /posts/{postId}", () => {
  it("is allowed to get comments in anyway", async () => {
    await expect(
      assertSucceeds(
        app
          .firestore()
          .collection("posts")
          .get()
      )
    ).resolves.toBeDefined();
  });
});
