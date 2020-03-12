import GameSituation from "../types/GameSituation";
import GameStreetAction from "../types/GameStreetAction";
import assertArray from "./assertArray";
import assertObject from "./assertObject";
import assertGameStreetAction from "./assertGameStreetAction";

export default function assertPreflop(
  value: any,
  name: string = "value"
): asserts value is GameSituation["preflop"] {
  assertObject<"actions">(value, name);
  assertArray<GameStreetAction>(value.actions, `${name}.actions`);

  for (const [i, action] of value.actions.entries()) {
    assertGameStreetAction(action, `${name}.actions[${i}]`);
  }
}
