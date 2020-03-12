import assertOneOf from "./assertOneOf";
import { GameType } from "../types/GameSituation";

export default function assertGameType(
  value: any,
  name: string = "value"
): asserts value is GameType {
  assertOneOf(value, [GameType.cash, GameType.tournament], name);
}
