import { clearFirestoreData, initializeAdminApp } from "@firebase/testing";
import * as faker from "faker";
import * as createFirebaseFunctionsTest from "firebase-functions-test";
import { WrappedFunction } from "firebase-functions-test/lib/main";

describe("createPost()", () => {
  const projectId = faker.random.alphaNumeric(16);
  const title = "augue ut lectus arcu bibendum";
  const body =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Gravida cum sociis natoque penatibus et magnis dis. Interdum velit euismod in pellentesque massa placerat duis ultricies. Nullam eget felis eget nunc lobortis mattis aliquam faucibus purus. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Dictumst quisque sagittis purus sit amet volutpat. Pharetra magna ac placerat vestibulum lectus mauris. Quis commodo odio aenean sed adipiscing diam donec adipiscing tristique. Placerat orci nulla pellentesque dignissim enim sit amet. Sem viverra aliquet eget sit amet tellus cras. At quis risus sed vulputate odio ut enim blandit. Suscipit tellus mauris a diam maecenas sed enim ut. Aenean sed adipiscing diam donec. Vel facilisis volutpat est velit egestas dui id. Velit aliquet sagittis id consectetur purus. Id eu nisl nunc mi. Vel eros donec ac odio tempor orci dapibus ultrices. Bibendum ut tristique et egestas quis ipsum suspendisse ultrices. Pharetra sit amet aliquam id diam maecenas.\n\nFacilisi morbi tempus iaculis urna id. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Facilisis mauris sit amet massa vitae tortor. Faucibus scelerisque eleifend donec pretium. Quis enim lobortis scelerisque fermentum dui. Tincidunt id aliquet risus feugiat in ante metus dictum at. Diam vel quam elementum pulvinar etiam non quam lacus. Pellentesque pulvinar pellentesque habitant morbi tristique. Id aliquet risus feugiat in ante metus dictum at. Eu lobortis elementum nibh tellus.\n\nSemper risus in hendrerit gravida rutrum quisque non. Risus in hendrerit gravida rutrum. Mauris nunc congue nisi vitae suscipit tellus mauris. Suspendisse potenti nullam ac tortor vitae purus faucibus ornare. Leo a diam sollicitudin tempor id. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Amet nisl suscipit adipiscing bibendum. Quis varius quam quisque id diam vel quam elementum. Ac turpis egestas maecenas pharetra convallis posuere. Purus sit amet luctus venenatis lectus magna fringilla urna. Dui sapien eget mi proin. Viverra nibh cras pulvinar mattis nunc sed. Vulputate enim nulla aliquet porttitor lacus luctus accumsan tortor posuere. Vitae sapien pellentesque habitant morbi tristique senectus et netus. Nam libero justo laoreet sit. Tristique senectus et netus et. Praesent elementum facilisis leo vel fringilla est.";
  const gameSituation = {
    type: "CASH",
    smallBlindSize: 0.5,
    antiSize: 0,
    playerLength: 6,
    playerStackSizes: [135, 55, 160, 115, 104, 122],
    playerCards: [
      null,
      {
        left: { rank: 4, suit: "SPADE" },
        right: { rank: 11, suit: "DIAMOND" },
      },
      null,
      null,
      null,
      {
        left: { rank: 5, suit: "DIAMOND" },
        right: { rank: 5, suit: "SPADE" },
      },
    ],
    heroIndex: 5,
    preflop: {
      actions: [
        { playerIndex: 2, betSize: 0 },
        { playerIndex: 3, betSize: 0 },
        { playerIndex: 4, betSize: 0 },
        { playerIndex: 5, betSize: 2.2 },
        { playerIndex: 0, betSize: 0.5 },
        { playerIndex: 1, betSize: 2.2 },
      ],
    },
    flop: {
      communityCards: {
        left: { rank: 5, suit: "HEART" },
        center: { rank: 9, suit: "DIAMOND" },
        right: { rank: 8, suit: "HEART" },
      },
      actions: [
        { playerIndex: 1, betSize: 6 },
        { playerIndex: 5, betSize: 14.5 },
        { playerIndex: 1, betSize: 52.95 },
        { playerIndex: 5, betSize: 52.95 },
      ],
    },
    turn: {
      communityCard: { rank: 9, suit: "SPADE" },
      actions: [],
    },
    river: {
      communityCard: { rank: 7, suit: "HEART" },
      actions: [],
    },
  };

  const test = createFirebaseFunctionsTest();
  const firebaseAdminApp = initializeAdminApp({ projectId });
  const assertGameSituation = jest.fn();
  const assertObject = jest.fn();
  const assertPostBody = jest.fn();
  const assertPostTitle = jest.fn();
  let createPostFunc: WrappedFunction;

  beforeAll(async () => {
    // HACK:
    // @firebase/testing internally refers to firebase yet firebase-admin.
    // needs to let it use firebase instead
    // because FieldValue.serverTimestamp() is completely different object
    // ref. https://github.com/firebase/firebase-js-sdk/issues/2609
    const { firestore } = await import("firebase");
    jest.mock("firebase-admin", () => ({ firestore }));

    jest.mock("../assertions/assertGameSituation", () => ({
      default: assertGameSituation,
    }));
    jest.mock("../assertions/assertObject", () => ({ default: assertObject }));
    jest.mock("../assertions/assertPostBody", () => ({
      default: assertPostBody,
    }));
    jest.mock("../assertions/assertPostTitle", () => ({
      default: assertPostTitle,
    }));
    jest.mock("../firebaseAdminApp", () => ({ default: firebaseAdminApp }));

    const { default: createPost } = await import("./createPost");
    createPostFunc = test.wrap(createPost);
  });

  beforeEach(() => {
    assertGameSituation.mockName("assertGameSituation");
    assertObject.mockName("assertObject");
    assertPostBody.mockName("assertPostBody");
    assertPostTitle.mockName("assertPostTitle");
  });

  afterEach(async () => {
    assertGameSituation.mockReset();
    assertObject.mockReset();
    assertPostBody.mockReset();
    assertPostTitle.mockReset();

    await clearFirestoreData({ projectId });
  });

  it("validates the given data", async () => {
    await createPostFunc(
      { title, body, gameSituation },
      { auth: { uid: faker.random.alphaNumeric(16) } }
    );

    expect(assertObject).toHaveBeenCalledWith(
      { title, body, gameSituation },
      expect.any(String)
    );
    expect(assertPostTitle).toHaveBeenCalledWith(title, expect.any(String));
    expect(assertPostBody).toHaveBeenCalledWith(body, expect.any(String));
    expect(assertGameSituation).toHaveBeenCalledWith(
      gameSituation,
      expect.any(String)
    );
  });

  it("writes a post document to Firestore", async () => {
    const id = await createPostFunc(
      { title, body, gameSituation },
      { auth: { uid: faker.random.alphaNumeric(16) } }
    );

    const postSnapshot = await firebaseAdminApp
      .firestore()
      .collection("posts")
      .doc(id)
      .get();
    const post = postSnapshot.data()!;

    expect(post.title).toBe(title);
    expect(post.body).toBe(body);
    expect(post.totalLikes).toBe(0);
    expect(post.totalDislikes).toBe(0);
    expect(post.gameSituation).toEqual(gameSituation);
  });

  // TODO:
  // writes more validations
  //
});
