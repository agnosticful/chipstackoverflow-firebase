import { AuthenticationError, UserInputError } from "apollo-server-core";
import { firestore } from "firebase-admin";
import {
  FirestorePost,
  FirestorePostInput,
} from "../../../models/firestore/post";
import {
  assertPostTitle,
  assertPostBody,
  GameType,
  PlayingCard,
  Post,
  PostBody,
  PostTitle,
  StreetAction,
} from "../../../models/post";
import {
  deserializePost,
  serializeGameType,
  serializePlayingCards,
  serializeStreetAction,
} from "../../../serializers/post";
import { Context } from "../../context";

export default async (
  _: any,
  {
    title,
    body,
    gameType,
    playerLength,
    playerStackSizes,
    playerCards,
    communityCards,
    heroIndex,
    smallBlindSize,
    antiSize,
    preflopActions,
    flopActions,
    turnActions,
    riverActions,
  }: {
    title: string;
    body: string;
    gameType: GameType;
    playerLength: number;
    playerStackSizes: number[];
    playerCards: [PlayingCard, PlayingCard][];
    communityCards: PlayingCard[];
    heroIndex: number;
    smallBlindSize: number;
    antiSize: number;
    preflopActions: StreetAction[];
    flopActions: StreetAction[];
    turnActions: StreetAction[];
    riverActions: StreetAction[];
  },
  { userId }: Context
): Promise<Post> => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  validateTitle(title);
  validateBody(body);
  validatePlayerLength(playerLength);
  validatePlayerStackSizes({ playerStackSizes, playerLength });
  validatePlayerCards({ playerCards, playerLength });
  validateCommunityCards(communityCards);
  validateHeroIndex({ heroIndex, playerLength });
  validateSmallBlindSize(smallBlindSize);
  validateAntiSize(antiSize);

  // TODO: add validations for actions

  const reference = await firestore()
    .collection("posts")
    .add({
      title,
      body,
      gameType: serializeGameType(gameType),
      playerLength,
      playerStackSizes,
      playerCards: playerCards.map((value) =>
        value ? serializePlayingCards(value) : value
      ),
      communityCards: serializePlayingCards(communityCards),
      heroIndex,
      smallBlindSize,
      antiSize,
      preflopActions: preflopActions.map((action) =>
        serializeStreetAction(action)
      ),
      flopActions: flopActions.map((action) => serializeStreetAction(action)),
      turnActions: turnActions.map((action) => serializeStreetAction(action)),
      riverActions: riverActions.map((action) => serializeStreetAction(action)),
      likes: 0,
      dislikes: 0,
      author: firestore().collection("userProfiles").doc(userId),
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
    } as FirestorePostInput);

  return deserializePost(
    (await reference.get()) as firestore.DocumentSnapshot<FirestorePost>
  );
};

function validateTitle(title: string): asserts title is PostTitle {
  try {
    assertPostTitle(title, "title");
  } catch (error) {
    new UserInputError(error.message);
  }
}

function validateBody(body: string): asserts body is PostBody {
  try {
    assertPostBody(body, "title");
  } catch (error) {
    new UserInputError(error.message);
  }
}

function validatePlayerLength(playerLength: number): void {
  if (playerLength < 0 || playerLength > 10) {
    throw new UserInputError(
      "playerLength is invalid. playerLength must be a positive integer and less or equal than 10."
    );
  }
}

function validatePlayerStackSizes({
  playerStackSizes,
  playerLength,
}: {
  playerStackSizes: number[];
  playerLength: number;
}): void {
  if (playerStackSizes.length !== playerLength) {
    throw new UserInputError(
      "playerStackSizes is invalid. its length must be the same with playerLength."
    );
  }

  for (const [i, value] of playerStackSizes.entries()) {
    if (value <= 0) {
      throw new UserInputError(
        `playerStackSizes[${i}] is invalid. Each item in playerStackSizes must be positive number.`
      );
    }
  }
}

function validatePlayerCards({
  playerCards,
  playerLength,
}: {
  playerCards: [PlayingCard, PlayingCard][];
  playerLength: number;
}): void {
  if (playerCards.length !== playerLength) {
    throw new UserInputError(
      "playerCards is invalid. its length must be the same with playerLength."
    );
  }

  for (const [i, value] of playerCards.entries()) {
    if (value !== null && value.length !== 2) {
      throw new UserInputError(
        `playerCards[${i}] is invalid. Each item in playerCards must be null or a pair of playing cards.`
      );
    }
  }
}

function validateCommunityCards(communityCards: PlayingCard[]): void {
  if (![0, 3, 4, 5].includes(communityCards.length)) {
    throw new UserInputError(
      "communityCards is invalid. The length of communityCards must be 0, 3, 4 or 5."
    );
  }
}

function validateHeroIndex({
  heroIndex,
  playerLength,
}: {
  heroIndex: number;
  playerLength: number;
}): void {
  if (heroIndex < 0 || heroIndex >= playerLength) {
    throw new UserInputError(
      "heroIndex is invalid. heroIndex must be a positive integer less than playerLength."
    );
  }
}

function validateSmallBlindSize(smallBlindSize: number): void {
  if (smallBlindSize <= 0 || smallBlindSize >= 1) {
    throw new UserInputError(
      "smallBlindSize is invalid. smallBlindSize must be greater than 0 and less than 1."
    );
  }
}

function validateAntiSize(antiSize: number): void {
  if (antiSize < 0 || antiSize >= 1) {
    throw new UserInputError(
      "antiSize is invalid. antiSize must be a positive number less than 1."
    );
  }
}
