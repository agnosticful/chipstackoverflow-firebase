import { ApolloServer } from "apollo-server-cloud-functions";
import context from "./context";
import resolvers from "./resolvers";
import schema from "./schema";

export default new ApolloServer({
  typeDefs: schema,
  resolvers,
  context,
  introspection: true,
  playground: {
    endpoint: "/graphql",
  },
  // tracing: true,
  engine: {
    apiKey: "service:chipstackoverflow:f6tO9MtFz4OR-jwpEICpeg",
  },
});
