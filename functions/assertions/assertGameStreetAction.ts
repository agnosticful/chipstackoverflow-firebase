import GameStreetAction, {
  GameStreetActionType,
} from "../types/GameStreetAction";
import assertDouble from "./assertDouble";
import assertInteger from "./assertInteger";
import assertObject from "./assertObject";
import assertOneOf from "./assertOneOf";

export default function assertGameStreetAction(
  value: any,
  name: string = "value"
): asserts value is GameStreetAction {
  assertObject<"type" | "playerIndex" | "betSize">(value, name);
  assertOneOf(
    value.type,
    [
      GameStreetActionType.fold,
      GameStreetActionType.check,
      GameStreetActionType.call,
      GameStreetActionType.bet,
      GameStreetActionType.raise,
    ],
    `${name}.type`
  );
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
