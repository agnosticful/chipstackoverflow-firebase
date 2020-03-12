import GameSituation from "../types/GameSituation";
import GameStreetAction from "../types/GameStreetAction";
import assertArray from "./assertArray";
import assertGameStreetAction from "./assertGameStreetAction";
import assertObject from "./assertObject";
import assertPlayingCard from "./assertPlayingCard";

export default function assertFlop(
  value: any,
  name: string = "value"
): asserts value is GameSituation["flop"] | void {
  assertObject<"communityCards" | "actions">(value, name);
  assertObject<"left" | "center" | "right">(
    value.communityCards,
    `${name}.communityCards`
  );
  assertPlayingCard(value.communityCards.left, `${name}.communityCards.left`);
  assertPlayingCard(
    value.communityCards.center,
    `${name}.communityCards.center`
  );
  assertPlayingCard(value.communityCards.right, `${name}.communityCards.right`);
  assertArray<GameStreetAction>(value.actions, `${name}.actions`);

  for (const [i, action] of value.actions.entries()) {
    assertGameStreetAction(action, `${name}.actions[${i}]`);
  }
}
