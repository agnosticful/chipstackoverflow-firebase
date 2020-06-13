import { firestore } from "firebase-admin";
import {
  GameType,
  PlayingCard,
  Post,
  Rank,
  Suit,
  StreetAction,
  StreetActionType,
} from "../models/post";
import {
  FirestoreGameType,
  FirestorePost,
  FirestoreStreetAction,
  FirestoreStreetActionType,
} from "../models/firestore/post";

export function deserializePost(
  snapshot: firestore.DocumentSnapshot<FirestorePost>
): Post {
  return {
    id: snapshot.id,
    title: snapshot.data()!.title,
    body: snapshot.data()!.body,
    gameType: deserializeGameType(snapshot.data()!.gameType),
    playerLength: snapshot.data()!.playerLength,
    playerStackSizes: snapshot.data()!.playerStackSizes,
    playerCards: snapshot
      .data()!
      .playerCards.map((playerCards) =>
        playerCards ? deserializePlayingCardsPair(playerCards) : null
      ),
    communityCards: deserializePlayingCards(snapshot.data()!.communityCards),
    heroIndex: snapshot.data()!.heroIndex,
    smallBlindSize: snapshot.data()!.smallBlindSize,
    antiSize: snapshot.data()!.antiSize,
    preflopActions: snapshot
      .data()!
      .preflopActions.map((action) => deserializeStreetAction(action)),
    flopActions: snapshot
      .data()!
      .flopActions.map((action) => deserializeStreetAction(action)),
    turnActions: snapshot
      .data()!
      .turnActions.map((action) => deserializeStreetAction(action)),
    riverActions: snapshot
      .data()!
      .riverActions.map((action) => deserializeStreetAction(action)),
    likes: snapshot.data()!.likes,
    dislikes: snapshot.data()!.dislikes,
    authorId: snapshot.data()!.author.id,
    createdAt: snapshot.data()!.createdAt.toDate(),
    lastUpdatedAt: snapshot.data()!.lastUpdatedAt.toDate(),
  };
}

export function deserializeGameType(value: FirestoreGameType): GameType {
  switch (value) {
    case "CASH":
      return GameType.cash;
    case "TOURNAMENT":
      return GameType.tournament;
  }
}

export function serializeGameType(value: GameType): FirestoreGameType {
  console.log(value);

  switch (value) {
    case GameType.cash:
      return "CASH";
    case GameType.tournament:
      return "TOURNAMENT";
  }
}

export function deserializePlayingCards(value: string): PlayingCard[] {
  if (!/^([A2-9TJQK][shdc])+$/.test(value)) {
    throw new Error();
  }

  const playingCards = [];

  for (let i = 0; i < value.length; i += 2) {
    playingCards.push(deserializePlayingCard(value.substring(i, i + 2)));
  }

  return playingCards;
}

export function deserializePlayingCardsPair(
  value: string
): [PlayingCard, PlayingCard] {
  const playingCards = deserializePlayingCards(value);

  if (playingCards.length !== 2) {
    throw new Error();
  }

  return playingCards as [PlayingCard, PlayingCard];
}

export function deserializePlayingCard(value: string): PlayingCard {
  if (!/^[A2-9TJQK][shdc]$/.test(value)) {
    throw new Error();
  }

  return {
    rank: charToRank(value[0]),
    suit: charToSuit(value[1]),
  };
}

export function serializePlayingCards(value: PlayingCard[]): string {
  return value.reduce(
    (str, { rank, suit }) => `${str}${rankToChar(rank)}${suitToChar(suit)}`,
    ""
  );
}

function charToRank(char: string): Rank {
  switch (char) {
    case "A":
      return Rank.ace;
    case "2":
      return Rank.deuce;
    case "3":
      return Rank.three;
    case "4":
      return Rank.four;
    case "5":
      return Rank.five;
    case "6":
      return Rank.six;
    case "7":
      return Rank.seven;
    case "8":
      return Rank.eight;
    case "9":
      return Rank.nine;
    case "T":
      return Rank.ten;
    case "J":
      return Rank.jack;
    case "Q":
      return Rank.queen;
    case "K":
      return Rank.king;
  }

  throw new Error(
    `Rank deserialize failed. ${char} is not an effective value as Rank.`
  );
}

function rankToChar(rank: Rank): string {
  switch (rank) {
    case Rank.ace:
      return "A";
    case Rank.deuce:
      return "2";
    case Rank.three:
      return "3";
    case Rank.four:
      return "4";
    case Rank.five:
      return "5";
    case Rank.six:
      return "6";
    case Rank.seven:
      return "7";
    case Rank.eight:
      return "8";
    case Rank.nine:
      return "9";
    case Rank.ten:
      return "T";
    case Rank.jack:
      return "J";
    case Rank.queen:
      return "Q";
    case Rank.king:
      return "K";
  }
}

function charToSuit(char: string): Suit {
  switch (char) {
    case "s":
      return Suit.spade;
    case "h":
      return Suit.heart;
    case "d":
      return Suit.diamond;
    case "c":
      return Suit.club;
  }

  throw new Error(
    `Suit deserialize failed. ${char} is not an effective value as Suit.`
  );
}

function suitToChar(suit: Suit): string {
  switch (suit) {
    case Suit.spade:
      return "s";
    case Suit.heart:
      return "h";
    case Suit.diamond:
      return "d";
    case Suit.club:
      return "c";
  }
}

function deserializeStreetAction(value: FirestoreStreetAction): StreetAction {
  return {
    type: deserializeStreetActionType(value.type),
    playerIndex: value.playerIndex,
    betSize: value.betSize,
  };
}

function deserializeStreetActionType(
  value: FirestoreStreetActionType
): StreetActionType {
  switch (value) {
    case "FOLD":
      return StreetActionType.fold;
    case "CHECK":
      return StreetActionType.check;
    case "CALL":
      return StreetActionType.call;
    case "BET":
      return StreetActionType.bet;
    case "RAISE":
      return StreetActionType.raise;
  }
}

export function serializeStreetAction(
  value: StreetAction
): FirestoreStreetAction {
  return {
    type: serializeStreetActionType(value.type),
    playerIndex: value.playerIndex,
    betSize: value.betSize,
  };
}

function serializeStreetActionType(
  value: StreetActionType
): FirestoreStreetActionType {
  switch (value) {
    case StreetActionType.fold:
      return "FOLD";
    case StreetActionType.check:
      return "CHECK";
    case StreetActionType.call:
      return "CALL";
    case StreetActionType.bet:
      return "BET";
    case StreetActionType.raise:
      return "RAISE";
  }
}
