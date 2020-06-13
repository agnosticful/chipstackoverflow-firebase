import { FirestoreReactionType } from "../models/firestore/reaction";
import { ReactionType } from "../models/reaction";

export function deserializeReactionType(
  value: FirestoreReactionType
): ReactionType {
  switch (value) {
    case "LIKE":
      return ReactionType.like;
    case "DISLIKE":
      return ReactionType.dislike;
  }
}
