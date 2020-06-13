export interface Comment {
  readonly id: string;
  readonly body: CommentBody;
  readonly likes: number;
  readonly dislikes: number;
  readonly authorId: string;
  readonly postId: string;
  readonly answerId: string;
  readonly createdAt: Date;
  readonly lastUpdatedAt: Date;
}

export type CommentBody = string & {
  _CommentBodyBrand: never;
};

export function assertCommentBody(
  value: string,
  name: string = "value"
): asserts value is CommentBody {
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
