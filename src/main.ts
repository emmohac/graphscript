import { GraphQLResolveInfo } from "graphql";
import { schemaComposer } from "graphql-compose";
import jwt from "jsonwebtoken";

import { UserResponseTC } from "../src/Resolvers";

schemaComposer.Query.addFields({
  UserLogin: UserResponseTC.getResolver("login"),
  Hello: {
    type: "String",
    args: {
      content: "String"
    },
    resolve: async (
      _source: any,
      args: any,
      _context: any,
      _info: GraphQLResolveInfo
    ) => {
      return `Did you just say ${args.content}`;
    }
  },
  Protected: {
    type: "String",
    resolve: async (
      _source: any,
      _args: any,
      context: any,
      _info: GraphQLResolveInfo
    ) => {
      if (!context.authorization) {
        return "Not permitted";
      }
      try {
        const result = jwt.verify(
          context.authorization,
          process.env.SECRET_KEY as string
        );
      } catch (error) {
        return `Got error from JTW: ${error}`;
      }
      return "Permitted";
    }
  }
});

schemaComposer.Mutation.addFields({
  UserRegister: UserResponseTC.getResolver("register")
});

export const schema = schemaComposer.buildSchema();
