import { schemaComposer } from "graphql-compose";

import {
  UserResponseTC,
  ApplicationResponseTC,
  FriendResponseTC
} from "../src/Resolvers";

schemaComposer.Query.addFields({
  UserLogin: UserResponseTC.getResolver("login"),
  GetApplication: ApplicationResponseTC.getResolver("get_applications"),
  GetFriend: FriendResponseTC.getResolver("get_friend"),
  GetFriendApplication: FriendResponseTC.getResolver("get_friend_application"),
  Hello: {
    type: "String",
    resolve: async (rp) => {
      return "World";
    }
  }
});

schemaComposer.Mutation.addFields({
  UserRegister: UserResponseTC.getResolver("register"),
  AddApplication: ApplicationResponseTC.getResolver("add_application"),
  RemoveApplication: ApplicationResponseTC.getResolver("remove_application"),
  AddFriend: FriendResponseTC.getResolver("add_friend"),
  RemoveFriend: FriendResponseTC.getResolver("remove_friend")
});

export const schema = schemaComposer.buildSchema();
