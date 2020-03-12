export default function assertArray<T extends any>(
  value: any,
  name: string = "value"
): asserts value is T[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`${name} must be an array.`);
  }
}
