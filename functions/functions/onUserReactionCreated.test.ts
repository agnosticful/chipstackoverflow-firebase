import { firestore } from "firebase-admin";
import * as createFirebaseFunctionsTest from "firebase-functions-test";
import { WrappedFunction } from "firebase-functions-test/lib/main";
import nanoid = require("nanoid");

describe("onUserReactionCreated()", () => {
  const firebaseTest = createFirebaseFunctionsTest();
  let testOnUserReactionCreated: WrappedFunction;

  const app = { firestore: jest.fn() };
  const runTransaction = jest.fn();
  const transaction = {
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };

  const answer = {
    foobar: "FOOBAR",
    likes: 4,
    dislikes: 5
  };
  const answerSnapshot = firebaseTest.firestore.makeDocumentSnapshot(
    answer,
    `/posts/${nanoid()}/answers/${nanoid()}`
  );

  beforeAll(async () => {
    const { default: func } = await import("./onUserReactionCreated");
    testOnUserReactionCreated = firebaseTest.wrap(func);

    jest.mock("../firebaseAdminApp", () => ({ default: app }));
  });

  beforeEach(() => {
    app.firestore
      .mockName("app.firestore()")
      .mockReturnValue({ runTransaction });
    runTransaction
      .mockName("runTransaction()")
      .mockImplementation(callback => callback(transaction));
    transaction.get.mockName("transaction.get()");
    transaction.create
      .mockName("transaction.create()")
      .mockReturnValue(transaction);
    transaction.update
      .mockName("transaction.update()")
      .mockReturnValue(transaction);
  });

  afterEach(() => {
    app.firestore.mockReset();
    runTransaction.mockReset();
    transaction.get.mockReset();
    transaction.create.mockReset();
    transaction.update.mockReset();
  });

  it("creates a copy of user's reaction into the target answer or comment", async () => {
    const type = "LIKE";
    const userReactionSnapshot = firebaseTest.firestore.makeDocumentSnapshot(
      { to: answerSnapshot.ref, type },
      `/users/loremipsum/reactions/${nanoid()}`
    );

    transaction.get.mockReturnValueOnce({ empty: true });
    transaction.get.mockReturnValueOnce(answerSnapshot);

    await testOnUserReactionCreated(userReactionSnapshot);

    expect(transaction.create).toHaveBeenCalledWith(
      expect.any(firestore.DocumentReference),
      {
        type,
        user: userReactionSnapshot.ref.parent.parent,
        userReaction: userReactionSnapshot.ref
      }
    );
  });

  it('increments number of likes of the target answer or comment if it\'s "LIKE"', async () => {
    const userReactionSnapshot = firebaseTest.firestore.makeDocumentSnapshot(
      { to: answerSnapshot.ref, type: "LIKE" },
      `/users/loremipsum/reactions/${nanoid()}`
    );

    transaction.get.mockReturnValueOnce({ empty: true });
    transaction.get.mockReturnValueOnce(answerSnapshot);

    await testOnUserReactionCreated(userReactionSnapshot);

    expect(transaction.update).toHaveBeenCalledWith(
      expect.any(firestore.DocumentReference),
      {
        ...answer,
        likes: answer.likes + 1
      }
    );
  });

  it('increments number of dislikes of the target answer or comment if it\'s "DISLIKE"', async () => {
    const userReactionSnapshot = firebaseTest.firestore.makeDocumentSnapshot(
      { to: answerSnapshot.ref, type: "DISLIKE" },
      `/users/loremipsum/reactions/${nanoid()}`
    );

    transaction.get.mockReturnValueOnce({ empty: true });
    transaction.get.mockReturnValueOnce(answerSnapshot);

    await testOnUserReactionCreated(userReactionSnapshot);

    expect(transaction.update).toHaveBeenCalledWith(
      expect.any(firestore.DocumentReference),
      {
        ...answer,
        dislikes: answer.dislikes + 1
      }
    );
  });

  it("does nothing if the reaction copy already exists", async () => {
    const userReactionSnapshot = firebaseTest.firestore.makeDocumentSnapshot(
      { to: answerSnapshot.ref, type: "LIKE" },
      `/users/loremipsum/reactions/${nanoid()}`
    );

    transaction.get.mockReturnValueOnce({ empty: false });
    transaction.get.mockReturnValueOnce(answerSnapshot);

    await testOnUserReactionCreated(userReactionSnapshot);

    expect(transaction.create).not.toHaveBeenCalled();
    expect(transaction.update).not.toHaveBeenCalled();
  });
});
