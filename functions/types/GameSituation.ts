import GameStreetAction from "./GameStreetAction";
import PlayingCard from "./PlayingCard";

export default interface GameSituation {
  type: GameType;
  smallBlindSize: number;
  antiSize: number;
  players: number;
  playerStackSizes: number[];
  playerCards: ([PlayingCard, PlayingCard] | null)[];
  heroIndex: number;
  preflop: {
    actions: GameStreetAction[];
  };
  flop: {
    communityCards: [PlayingCard, PlayingCard, PlayingCard];
    actions: GameStreetAction[];
  } | null;
  turn: {
    communityCard: PlayingCard;
    actions: GameStreetAction[];
  } | null;
  river: {
    communityCard: PlayingCard;
    actions: GameStreetAction[];
  } | null;
}

export enum GameType {
  cash = "CASH",
  tournament = "TOURNAMENT",
}
