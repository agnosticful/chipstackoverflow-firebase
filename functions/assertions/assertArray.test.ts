import assertArray from "./assertArray";

describe("assertArray()", () => {
  test("throws an error if the value is not an array", () => {
    expect(() => assertArray({ foo: "bar" }, "")).toThrow();
    expect(() => assertArray("loremipsum", "")).toThrow();
  });

  test("doesn't throw an error as long as the value is an array", () => {
    expect(() => assertArray([], "")).not.toThrow();
    expect(() => assertArray([1, 2, 3, 4, 5], "")).not.toThrow();
  });
});
