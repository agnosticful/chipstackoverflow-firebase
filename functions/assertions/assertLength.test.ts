import assertLength from "./assertLength";

describe("assertLength()", () => {
  test("throws an error if the length of value is less than option.minimumLength", () => {
    expect(() =>
      assertLength(
        [1, 2, 3, 4, 5, 6],
        { minimumLength: 7, maximumLength: 10 },
        ""
      )
    ).toThrow();
    expect(() =>
      assertLength("abcdef", { minimumLength: 7, maximumLength: 10 }, "")
    ).toThrow();
  });

  test("throws an error if the length of value is more than or equal option.maximumLength", () => {
    expect(() =>
      assertLength([1, 2, 3, 4, 5, 6, 7, 8], { maximumLength: 8 }, "")
    ).toThrow();
    expect(() =>
      assertLength(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        { minimumLength: 7, maximumLength: 10 },
        ""
      )
    ).toThrow();
    expect(() => assertLength("abcdefgh", { maximumLength: 8 }, "")).toThrow();
    expect(() =>
      assertLength("abcdefghijk", { minimumLength: 7, maximumLength: 10 }, "")
    ).toThrow();
  });

  test("doesn't throw an error as long as the given value is an array", () => {
    expect(() =>
      assertLength([1, 2, 3], { maximumLength: 8 }, "")
    ).not.toThrow();
    expect(() =>
      assertLength(
        [1, 2, 3, 4, 5, 6, 7],
        { minimumLength: 7, maximumLength: 10 },
        ""
      )
    ).not.toThrow();
    expect(() =>
      assertLength([1, 2, 3], { maximumLength: 8 }, "")
    ).not.toThrow();
    expect(() =>
      assertLength(
        [1, 2, 3, 4, 5, 6, 7],
        { minimumLength: 7, maximumLength: 10 },
        ""
      )
    ).not.toThrow();
    expect(() =>
      assertLength("abcdefg", { maximumLength: 8 }, "")
    ).not.toThrow();
    expect(() =>
      assertLength("abcdefg", { minimumLength: 7, maximumLength: 10 }, "")
    ).not.toThrow();
  });
});
