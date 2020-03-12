import GameSituation from "../types/GameSituation";
import GameStreetAction from "../types/GameStreetAction";
import assertArray from "./assertArray";
import assertGameStreetAction from "./assertGameStreetAction";
import assertObject from "./assertObject";
import assertPlayingCard from "./assertPlayingCard";

export default function assertRiver(
  value: any,
  name: string = "value"
): asserts value is GameSituation["river"] | void {
  if (value === undefined) return;

  assertObject<"communityCard" | "actions">(value, name);
  assertPlayingCard(value.communityCard, `${name}.communityCard`);
  assertArray<GameStreetAction>(value.actions, `${name}.actions`);

  for (const [i, action] of value.actions.entries()) {
    assertGameStreetAction(action, `${name}.actions[${i}]`);
  }
}
