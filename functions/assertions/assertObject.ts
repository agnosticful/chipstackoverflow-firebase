import * as util from "util";

export default function assertObject<Keys extends string>(
  value: any,
  name: string = "value"
): asserts value is { [Key in Keys]: any } {
  if (!util.isObject(value)) {
    throw new TypeError(`${name} must be an object.`);
  }
}
