import { schemaComposer } from "graphql-compose";

import { UserResponseTC, ApplicationResponseTC } from "../src/Resolvers";

schemaComposer.Query.addFields({
  UserLogin: UserResponseTC.getResolver("login"),
  GetApplication: ApplicationResponseTC.getResolver("get_applications")
});

schemaComposer.Mutation.addFields({
  UserRegister: UserResponseTC.getResolver("register"),
  AddApplication: ApplicationResponseTC.getResolver("add_application"),
  RemoveApplication: ApplicationResponseTC.getResolver("remove_application")
});

export const schema = schemaComposer.buildSchema();
