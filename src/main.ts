import { GraphQLResolveInfo } from "graphql";
import { schemaComposer } from "graphql-compose";
import jwt from "jsonwebtoken";

import { UserResponseTC } from "../src/Resolvers";
import { ApplicationInputTC } from "../src/TypeComposes";

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
      const { authorization }: { authorization: string } = context;
      if (!authorization) {
        return "Not permitted";
      }

      try {
        const result = jwt.verify(
          authorization.slice(7), // skipping 'Bearer '
          process.env.SECRET_KEY as string
        );
      } catch (error) {
        return `Got error from JTW: ${error}`;
      }
      return "Permitted";
    }
  },
  AddApplication: {
    type: "String",
    args: {
      input: ApplicationInputTC
    },
    resolve: async (source: any, args: any, context: any, info: any) => {
      console.log(args.input);
      return "Cool";
    }
  }
});

schemaComposer.Mutation.addFields({
  UserRegister: UserResponseTC.getResolver("register")
});

export const schema = schemaComposer.buildSchema();
