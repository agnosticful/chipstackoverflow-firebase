import { Context as ApolloContext } from "apollo-server-core";
import * as functions from "firebase-functions";
import authenticate from "./authenticate";
import injectBatchLoaders, { BatchLoaders } from "./inject-batch-loaders";

export default async ({ req }: { req: functions.https.Request }) => {
  let context = {};

  context = await authenticate(req, context as any);
  context = await injectBatchLoaders(req, context as any);

  return context;
};

export type Context = ApolloContext<{
  userId: string | null;
  batchLoaders: BatchLoaders;
}>;
