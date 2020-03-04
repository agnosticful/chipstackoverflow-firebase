import * as createFirebaseFunctionsTest from "firebase-functions-test";
import ping from "./ping";

describe("ping()", () => {
  const test = createFirebaseFunctionsTest();

  it('returns "pong"', async () => {
    const pingFunc = test.wrap(ping);

    expect(await pingFunc({})).toBe("pong");
  });
});
