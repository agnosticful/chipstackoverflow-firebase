export interface Answer {
  readonly id: string;
  readonly body: AnswerBody;
  readonly likes: number;
  readonly dislikes: number;
  readonly authorId: string;
  readonly postId: string;
  readonly createdAt: Date;
  readonly lastUpdatedAt: Date;
}

export type AnswerBody = string & {
  _AnswerBodyBrand: never;
};

export function assertAnswerBody(
  value: string,
  name: string = "value"
): asserts value is AnswerBody {
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
