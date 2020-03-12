import GameSituation from "../types/GameSituation";
import PlayingCard from "../types/PlayingCard";
import assertArray from "./assertArray";
import assertDouble from "./assertDouble";
import assertFlop from "./assertFlop";
import assertGameType from "./assertGameType";
import assertInteger from "./assertInteger";
import assertObject from "./assertObject";
import assertPlayingCard from "./assertPlayingCard";
import assertPreflop from "./assertPreflop";
import assertRiver from "./assertRiver";
import assertTurn from "./assertTurn";

type Keys =
  | "type"
  | "smallBlindSize"
  | "antiSize"
  | "playerLength"
  | "playerStackSizes"
  | "playerCards"
  | "heroIndex"
  | "preflop"
  | "flop"
  | "turn"
  | "river";

export default function assertGameSituation(
  value: any,
  name: string = "value"
): asserts value is GameSituation {
  assertObject<Keys>(value, `${name}`);

  const {
    type,
    smallBlindSize,
    antiSize,
    playerLength,
    playerStackSizes,
    playerCards,
    heroIndex,
    preflop,
    flop,
    turn,
    river
  } = value;

  assertGameType(type, `${name}.type`);
  assertDouble(
    smallBlindSize,
    { minimum: 0.001, maximum: 1 },
    `${name}.smallBlindSize`
  );
  assertDouble(antiSize, { minimum: 0, maximum: 1 }, `${name}.antiSize`);
  assertInteger(
    playerLength,
    { minimum: 2, maximum: 11 },
    `${name}.assertInteger`
  );
  assertArray<number>(playerStackSizes, `${name}.playerStackSizes`);
  assertArray<{ left: PlayingCard; right: PlayingCard } | null>(
    playerCards,
    `${name}.playerStackSizes`
  );
  assertInteger(
    heroIndex,
    { minimum: 0, maximum: playerLength },
    `${name}.heroIndex`
  );
  assertPreflop(preflop, `${name}.preflop`);
  assertFlop(flop, `${name}.flop`);
  assertTurn(turn, `${name}.turn`);
  assertRiver(river, `${name}.river`);

  for (const [i, stackSize] of playerStackSizes.entries()) {
    assertDouble(
      stackSize,
      { minimum: 0, maximum: Infinity },
      `${name}.playerStackSizes[${i}]`
    );
  }

  for (const [i, cards] of playerCards.entries()) {
    if (cards === null) continue;

    assertObject<"left" | "right">(cards, `${name}.playerCards[${i}]`);
    assertPlayingCard(cards.left, `${name}.playerCards[${i}].left`);
    assertPlayingCard(cards.right, `${name}.playerCards[${i}].right`);
  }
}
