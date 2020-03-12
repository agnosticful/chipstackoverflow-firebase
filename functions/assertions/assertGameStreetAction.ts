import GameStreetAction from "../types/GameStreetAction";
import assertDouble from "./assertDouble";
import assertInteger from "../assertions/assertInteger";
import assertObject from "../assertions/assertObject";

export default function assertGameStreetAction(
  value: any,
  name: string = "value"
): asserts value is GameStreetAction {
  assertObject<"playerIndex" | "betSize">(value, name);
  assertInteger(
    value.playerIndex,
    { minimum: 0, maximum: 11 },
    `${name}.playerIndex`
  );
  assertDouble(
    value.betSize,
    { minimum: 0, maximum: Infinity },
    `${name}.betSize`
  );
}
