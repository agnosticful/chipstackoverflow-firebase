export default interface GameStreetAction {
  playerIndex: number;
  type: GameStreetActionType;
  betSize: number;
}

export enum GameStreetActionType {
  fold = "FOLD",
  check = "CHECK",
  call = "CALL",
  bet = "BET",
  raise = "RAISE",
}
