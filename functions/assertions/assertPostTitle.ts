import assertLength from "./assertLength";
import assertString from "./assertString";

export default function assertPostTitle(
  value: any,
  name: string = "value"
): asserts value is string {
  assertString(value, name);
  assertLength(value, { minimumLength: 8, maximumLength: 65536 }, name);
}
