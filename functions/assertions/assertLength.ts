export default function assertLength<T extends string | Array<any>>(
  value: T,
  {
    minimumLength = 0,
    maximumLength = Infinity
  }: {
    minimumLength?: number;
    maximumLength?: number;
  },
  name: string = "value"
): asserts value is T {
  if (value.length < minimumLength || value.length >= maximumLength) {
    throw new Error(
      `The length of ${name} must be more than or equal ${minimumLength} and less than ${maximumLength}.`
    );
  }
}
