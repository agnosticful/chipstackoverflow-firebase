import PlayingCard, { Rank, Suit } from "../types/PlayingCard";
import assertObject from "./assertObject";
import assertOneOf from "./assertOneOf";

export default function assertPlayingCard(
  value: any,
  name: string = "value"
): asserts value is PlayingCard {
  assertObject<"rank" | "suit">(value, `${name}`);
  assertOneOf(value.rank, RANKS, `${name}.rank`);
  assertOneOf(value.suit, SUITS, `${name}.suit`);
}

const RANKS = [
  Rank.ace,
  Rank.deuce,
  Rank.three,
  Rank.four,
  Rank.five,
  Rank.six,
  Rank.seven,
  Rank.eight,
  Rank.nine,
  Rank.ten,
  Rank.jack,
  Rank.queen,
  Rank.king,
];

const SUITS = [Suit.spade, Suit.heart, Suit.diamond, Suit.club];
