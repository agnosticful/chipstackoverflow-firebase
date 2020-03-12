export default function assertString(
  value: any,
  name: string = "value"
): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`${name} must be a string.`);
  }
}
