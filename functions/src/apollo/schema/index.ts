import { gql } from "apollo-server-core";

export default gql`
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    """
    Returns the request user's profile.

    This query requires you are authenticated.
    """
    myself: UserProfile!

    """
    Returns the post by the given id.
    """
    post(postId: ID!): Post

    """
    Returns posts in popularity order.
    """
    popularPosts: [Post]!

    """
    Returns posts in reverse-chronological order.
    """
    recentPosts: [Post]!
  }

  type Mutation {
    """
    Creates a post by the given params and returns it.

    This query requires you are authenticated.
    """
    createPost(
      """
      Post's title.
      """
      title: String!

      """
      Post's body.
      """
      body: String!

      """

      """
      gameType: GameType!

      """
      Number of players.
      """
      playerLength: Int!

      """

      """
      playerStackSizes: [Float]!

      """

      """
      playerCards: [[PlayingCardInput]]!

      """

      """
      communityCards: [PlayingCardInput]!

      """

      """
      heroIndex: Int!

      """

      """
      smallBlindSize: Float!

      """

      """
      antiSize: Float!

      """

      """
      preflopActions: [StreetActionInput]!

      """

      """
      flopActions: [StreetActionInput]!

      """

      """
      turnActions: [StreetActionInput]!

      """

      """
      riverActions: [StreetActionInput]!
    ): Post!

    """
    Creates an answer to a post with the given params.
    """
    createAnswer(
      """
      ID that points the target Post.
      """
      postId: ID!

      """

      """
      body: String!
    ): Answer!

    """
    Creates an comment to an answer with the given params.
    """
    createComment(
      """
      ID that points the target post.
      """
      postId: ID!

      """
      ID that points the target answer.
      """
      answerId: ID!

      """

      """
      body: String!
    ): Comment!

    """
    Likes an answer. If the request user already disliked the answer, it will be un-disliked.
    """
    likeAnswer(postId: ID!, answerId: ID!): Boolean

    """
    Likes a comment. If the request user already disliked the answer, it will be un-disliked.
    """
    likeComment(postId: ID!, answerId: ID!, commentId: ID!): Boolean

    """
    Dislikes an answer. If the request user already disliked the answer, it will be un-liked.
    """
    dislikeAnswer(postId: ID!, answerId: ID!): Boolean

    """
    Dislikes a comment. If the request user already disliked the answer, it will be un-liked.
    """
    dislikeComment(postId: ID!, answerId: ID!, commentId: ID!): Boolean

    """
    Takes back like or dislike on an answer.
    """
    unlikeAnswer(postId: ID!, answerId: ID!): Boolean

    """
    Takes back like or dislike on a comment.
    """
    unlikeComment(postId: ID!, answerId: ID!, commentId: ID!): Boolean
  }

  type UserProfile {
    id: ID!
    name: String!
    imageURL: String!
  }

  type Post {
    """

    """
    id: ID!

    """

    """
    title: String!

    """

    """
    body: String!

    """

    """
    gameType: GameType!

    """

    """
    playerLength: Int!

    """

    """
    playerStackSizes: [Float]!

    """

    """
    playerCards: [[PlayingCard]]!

    """

    """
    communityCards: [PlayingCard]!

    """

    """
    heroIndex: Int!

    """

    """
    smallBlindSize: Float!

    """

    """
    antiSize: Float!

    """

    """
    preflopActions: [StreetAction]!

    """

    """
    flopActions: [StreetAction]!

    """

    """
    turnActions: [StreetAction]!

    """

    """
    riverActions: [StreetAction]!

    """

    """
    likes: Int!

    """

    """
    dislikes: Int!

    """

    """
    author: UserProfile!

    """

    """
    answers: [Answer]!

    """

    """
    createdAt: Timestamp!

    """

    """
    lastUpdatedAt: Timestamp!
  }

  enum GameType {
    """

    """
    CASH

    """

    """
    TOURNAMENT
  }

  type PlayingCard {
    rank: Rank!
    suit: Suit!
  }

  enum Rank {
    ACE
    DEUCE
    THREE
    FOUR
    FIVE
    SIX
    SEVEN
    EIGHT
    NINE
    TEN
    JACK
    QUEEN
    KING
  }

  enum Suit {
    SPADE
    HEART
    DIAMOND
    CLUB
  }

  type StreetAction {
    type: StreetActionType!
    playerIndex: Int!
    betSize: Float!
  }

  enum StreetActionType {
    FOLD
    CHECK
    CALL
    BET
    RAISE
  }

  type Answer {
    id: ID!

    """
    Answer body.
    """
    body: String!

    """
    Number of likes to the answer.
    """
    likes: Int!

    """
    Number of dislikes to the answer.
    """
    dislikes: Int!

    """
    Whether the request user liked the answer or not.
    """
    liked: Boolean!

    """
    Whether the request user disliked the answer or not.
    """
    disliked: Boolean!

    """
    The user who created the answer.
    """
    author: UserProfile!

    """
    The post which the answer created for.
    """
    post: Post!

    """
    The comments which are in the answer.
    """
    comments: [Comment]!

    """

    """
    createdAt: Timestamp!

    """

    """
    lastUpdatedAt: Timestamp!
  }

  type Comment {
    """

    """
    id: ID!

    """

    """
    body: String!

    """

    """
    likes: Int!

    """

    """
    dislikes: Int!

    """

    """
    liked: Boolean!

    """

    """
    disliked: Boolean!

    """

    """
    author: UserProfile!

    """

    """
    answer: Answer!

    """

    """
    createdAt: Timestamp!

    """

    """
    lastUpdatedAt: Timestamp!
  }

  input PlayingCardInput {
    rank: Rank!
    suit: Suit!
  }

  input StreetActionInput {
    type: StreetActionType!
    playerIndex: Int!
    betSize: Float!
  }

  """
  Date and time expression. Serialized as ISO-8601 string format.
  """
  scalar Timestamp
`;
