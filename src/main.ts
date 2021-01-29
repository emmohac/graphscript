import { GraphQLResolveInfo } from "graphql";
import { schemaComposer } from "graphql-compose";

import { userExtra } from "../src/Data/";

import { UserExtraTC, UserResponseTC } from "../src/Resolvers";

UserExtraTC.addFields({
  interest: UserExtraTC.getResolver("interest"),
  projects: UserExtraTC.getResolver("projects"),
  applications: UserExtraTC.getResolver("applications")
});

schemaComposer.Query.addFields({
  UserRegister: UserResponseTC.getResolver("register"),
  UserLogin: UserResponseTC.getResolver("login"),
  UserExtra: {
    type: UserExtraTC,
    args: {
      id: "String"
    },
    resolve: async (
      _source: any,
      _args: any,
      _context: any,
      _info: GraphQLResolveInfo
    ) => {
      return userExtra;
    }
  },
  Hello: {
      type: "String",
      args: {
          content: "String"
      },
      resolve: async (_source: any, args: any, _context: any, _info: GraphQLResolveInfo) => {
        return `Did you just say ${args.content}`;
      }
  }
});

export const schema = schemaComposer.buildSchema();
