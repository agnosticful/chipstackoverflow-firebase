import Answer from "./answer";
import Comment from "./comment";
import GameType from "./game-type";
import Mutation from "./mutation";
import Query from "./query";
import Post from "./post";
import Rank from "./rank";
import StreetActionType from "./street-action-type";
import Suit from "./suit";
import Timestamp from "./timestamp";

const resolvers = {
  Query,
  Mutation,
  Answer,
  Comment,
  GameType,
  Post,
  Rank,
  StreetActionType,
  Suit,
  Timestamp,
};

export default resolvers;
