import { firestore } from "firebase-admin";
import * as createFirebaseFunctionsTest from "firebase-functions-test";
import { WrappedFunction } from "firebase-functions-test/lib/main";
import nanoid = require("nanoid");

describe("onUserReactionDeleted()", () => {
  const firebaseTest = createFirebaseFunctionsTest();
  let testOnUserReactionDeleted: WrappedFunction;

  const app = { firestore: jest.fn() };
  const runTransaction = jest.fn();
  const transaction = {
    get: jest.fn(),
    delete: jest.fn(),
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
    const { default: func } = await import("./onUserReactionDeleted");
    testOnUserReactionDeleted = firebaseTest.wrap(func);

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
    transaction.delete
      .mockName("transaction.delete()")
      .mockReturnValue(transaction);
    transaction.update
      .mockName("transaction.update()")
      .mockReturnValue(transaction);
  });

  afterEach(() => {
    app.firestore.mockReset();
    runTransaction.mockReset();
    transaction.get.mockReset();
    transaction.delete.mockReset();
    transaction.update.mockReset();
  });

  it("deletes the copy of user's reaction", async () => {
    const userReactionSnapshot = firebaseTest.firestore.makeDocumentSnapshot(
      { to: answerSnapshot.ref, type: "LIKE" },
      `/users/loremipsum/reactions/${nanoid()}`
    );
    const reactionSnapshot = firebaseTest.firestore.makeDocumentSnapshot(
      {
        type: "LIKE",
        user: userReactionSnapshot.ref.parent.parent,
        userReaction: userReactionSnapshot.ref
      },
      `${answerSnapshot.ref.path}/reactions/${nanoid()}`
    );

    transaction.get.mockReturnValueOnce({
      empty: false,
      docs: [reactionSnapshot]
    });
    transaction.get.mockReturnValueOnce(answerSnapshot);

    await testOnUserReactionDeleted(userReactionSnapshot);

    expect(transaction.delete).toHaveBeenCalledWith(reactionSnapshot.ref);
  });

  it('decrements number of likes of the target answer or comment if it\'s "LIKE"', async () => {
    const userReactionSnapshot = firebaseTest.firestore.makeDocumentSnapshot(
      { to: answerSnapshot.ref, type: "LIKE" },
      `/users/loremipsum/reactions/${nanoid()}`
    );
    const reactionSnapshot = firebaseTest.firestore.makeDocumentSnapshot(
      {
        type: "LIKE",
        user: userReactionSnapshot.ref.parent.parent,
        userReaction: userReactionSnapshot.ref
      },
      `${answerSnapshot.ref.path}/reactions/${nanoid()}`
    );

    transaction.get.mockReturnValueOnce({
      empty: false,
      docs: [reactionSnapshot]
    });
    transaction.get.mockReturnValueOnce(answerSnapshot);

    await testOnUserReactionDeleted(userReactionSnapshot);

    expect(transaction.update).toHaveBeenCalledWith(
      expect.any(firestore.DocumentReference),
      {
        ...answer,
        likes: answer.likes - 1
      }
    );
  });

  it('decrements number of dislikes of the target answer or comment if it\'s "DISLIKE"', async () => {
    const userReactionSnapshot = firebaseTest.firestore.makeDocumentSnapshot(
      { to: answerSnapshot.ref, type: "DISLIKE" },
      `/users/loremipsum/reactions/${nanoid()}`
    );
    const reactionSnapshot = firebaseTest.firestore.makeDocumentSnapshot(
      {
        type: "DISLIKE",
        user: userReactionSnapshot.ref.parent.parent,
        userReaction: userReactionSnapshot.ref
      },
      `${answerSnapshot.ref.path}/reactions/${nanoid()}`
    );

    transaction.get.mockReturnValueOnce({
      empty: false,
      docs: [reactionSnapshot]
    });
    transaction.get.mockReturnValueOnce(answerSnapshot);

    await testOnUserReactionDeleted(userReactionSnapshot);

    expect(transaction.update).toHaveBeenCalledWith(
      expect.any(firestore.DocumentReference),
      {
        ...answer,
        dislikes: answer.dislikes - 1
      }
    );
  });

  it("does nothing if the reaction copy is already deleted", async () => {
    const userReactionSnapshot = firebaseTest.firestore.makeDocumentSnapshot(
      { to: answerSnapshot.ref, type: "LIKE" },
      `/users/loremipsum/reactions/${nanoid()}`
    );

    transaction.get.mockReturnValueOnce({ empty: true });
    transaction.get.mockReturnValueOnce(answerSnapshot);

    await testOnUserReactionDeleted(userReactionSnapshot);

    expect(transaction.delete).not.toHaveBeenCalled();
    expect(transaction.update).not.toHaveBeenCalled();
  });
});
