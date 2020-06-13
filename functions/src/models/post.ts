export interface Post {
  readonly id: string;
  readonly title: PostTitle;
  readonly body: PostBody;
  readonly gameType: GameType;
  readonly playerLength: number;
  readonly playerStackSizes: number[];
  readonly playerCards: ([PlayingCard, PlayingCard] | null)[];
  readonly communityCards: PlayingCard[];
  readonly heroIndex: number;
  readonly smallBlindSize: number;
  readonly antiSize: number;
  readonly preflopActions: StreetAction[];
  readonly flopActions: StreetAction[];
  readonly turnActions: StreetAction[];
  readonly riverActions: StreetAction[];
  readonly likes: number;
  readonly dislikes: number;
  readonly authorId: string;
  readonly createdAt: Date;
  readonly lastUpdatedAt: Date;
}

export type PostTitle = string & {
  _PostTitleBrand: never;
};

export type PostBody = string & {
  _PostBodyBrand: never;
};

export enum GameType {
  cash,
  tournament,
}

export interface PlayingCard {
  readonly rank: Rank;
  readonly suit: Suit;
}

export enum Rank {
  ace,
  deuce,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
  jack,
  queen,
  king,
}

export enum Suit {
  spade,
  heart,
  diamond,
  club,
}

export interface StreetAction {
  type: StreetActionType;
  playerIndex: number;
  betSize: number;
}

export enum StreetActionType {
  fold,
  check,
  call,
  bet,
  raise,
}

export function assertPostTitle(
  value: string,
  name: string = "value"
): asserts value is PostTitle {
  if (value.length < 8) {
    throw new Error(
      `${name} is too short. ${name} needs to be a 8-65535-length string.`
    );
  }

  if (value.length > 65535) {
    throw new Error(
      `${name} is too long. ${name} needs to be a 8-65535-length string.`
    );
  }
}

export function assertPostBody(
  value: string,
  name: string = "value"
): asserts value is PostBody {
  if (value.length < 8) {
    throw new Error(
      `${name} is too short. ${name} needs to be a 8-256-length string.`
    );
  }

  if (value.length > 256) {
    throw new Error(
      `${name} is too long. ${name} needs to be a 8-256-length string.`
    );
  }
}
