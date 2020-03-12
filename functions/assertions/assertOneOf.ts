export default function assertOneOf<T>(
  value: any,
  allowedValues: T[],
  name: string = "value"
): asserts value is T {
  if (!allowedValues.includes(value)) {
    throw new TypeError(
      `${name} must be one of [${allowedValues.join(", ")}].`
    );
  }
}
