import assertDouble from "./assertDouble";

export default function assertInteger(
  value: number,
  { minimum, maximum }: { minimum: number; maximum: number } = {
    minimum: 0,
    maximum: Infinity,
  },
  name: string = "value"
): asserts value is number {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError(`${name} must be an integer.`);
  }

  assertDouble(value, { minimum, maximum }, name);
}
