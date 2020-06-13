import { GraphQLScalarType, Kind } from "graphql";

export default new GraphQLScalarType({
  name: "Timestamp",
  serialize: (value) => new Date(value),
  parseValue: (value) => value.toJSON(),
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }

    return null;
  },
});
