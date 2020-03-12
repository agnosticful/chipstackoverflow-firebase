export default function assertDouble(
  value: any,
  { minimum, maximum }: { minimum: number; maximum: number } = {
    minimum: 0,
    maximum: Infinity
  },
  name: string = "value"
): asserts value is number {
  if (typeof value !== "number") {
    throw new TypeError(`${name} must be a number.`);
  }

  if (value < minimum || value >= maximum) {
    throw new TypeError(
      `${name} must be more than or equal ${minimum} and less than ${maximum}.`
    );
  }
}
