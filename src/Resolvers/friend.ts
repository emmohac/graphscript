import jwt from "jsonwebtoken";

import { FriendResponseTC } from "../TypeComposes";
import {
  JwtExpired,
  JwtNotProvided,
  InvalidToken,
  FriendNotExist
} from "../Errors";
import { User, IUser, Ctx } from "../Types";
import { userSchema } from "../Models/User";

FriendResponseTC.addResolver({
  name: "add_friend",
  type: FriendResponseTC,
  args: {
    email: "String!"
  },
  resolve: async ({ args, context }: { args: any; context: Ctx }) => {
    const { authorization } = context;
    if (!authorization) {
      return JwtNotProvided;
    }

    try {
      const result = jwt.verify(
        authorization.slice(7),
        process.env.SECRET_KEY as string
      ) as User;
      const { email: friendEmail } = args;
      const { conn } = context;
      const UserModel = conn.model("user", userSchema);
      const hasFriend = await UserModel.findOne({ email: friendEmail });
      if (!hasFriend) {
        return FriendNotExist;
      }
      const { email } = result;
      const response = await UserModel.findOneAndUpdate(
        { email },
        { $addToSet: { friends: friendEmail } }
      );
      console.log(response);
    } catch (error) {
      return error.name === jwt.TokenExpiredError.name
        ? JwtExpired
        : InvalidToken;
    }
    return {
      successful: true,
      errors: []
    };
  }
});

FriendResponseTC.addResolver({
  name: "get_friend",
  type: FriendResponseTC,
  resolve: async ({ context }: { context: Ctx }) => {
    const { authorization } = context;
    if (!authorization) {
      return JwtNotProvided;
    }

    try {
      const result = jwt.verify(
        authorization.slice(7),
        process.env.SECRET_KEY as string
      ) as User;
      const { email } = result;
      const { conn } = context;
      const UserModel = conn.model("user", userSchema);
      const response = (await UserModel.findOne(
        { email },
        { _id: 0, friends: 1 }
      )) as IUser;
      console.log(response);
      return {
        successful: true,
        items: response.friends,
        errors: []
      };
    } catch (error) {
      return error.name === jwt.TokenExpiredError.name
        ? JwtExpired
        : InvalidToken;
    }
  }
});

FriendResponseTC.addResolver({
  name: "remove_friend",
  type: FriendResponseTC,
  args: {
    email: "String!"
  },
  resolve: async ({ args, context }: { args: any; context: Ctx }) => {
    const { authorization }: { authorization: string } = context;
    if (!authorization) {
      return JwtNotProvided;
    }

    try {
      const result = jwt.verify(
        authorization.slice(7),
        process.env.SECRET_KEY as string
      ) as User;
      const { email } = result;
      const toRemove = args.email;
      const { conn } = context;
      const UserModel = conn.model("user", userSchema);
      const response = await UserModel.findOneAndUpdate(
        { email },
        { $pull: { friends: toRemove } }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
      return error.name === jwt.TokenExpiredError.name
        ? JwtExpired
        : InvalidToken;
    }
    return {
      successful: true,
      errors: []
    };
  }
});

FriendResponseTC.addResolver({
  name: "get_friend_application",
  type: FriendResponseTC,
  args: {
    email: "String!"
  },
  resolve: async ({ args, context }: { args: any; context: Ctx }) => {
    const { authorization }: { authorization: string } = context;
    if (!authorization) {
      return JwtNotProvided;
    }

    try {
      const { email: userEmail } = jwt.verify(
        authorization.slice(7),
        process.env.SECRET_KEY as string
      ) as User;
      const { email } = args;
      const { conn } = context;
      const UserModel = conn.model("user", userSchema);
      const response = (await UserModel.findOne(
        { email },
        { _id: 0, applications: 1, friends: 1 }
      )) as IUser;
      console.log(response);
      return {
        successful: true,
        applications: response.friends.includes(userEmail)
          ? response.applications
          : [],
        errors: []
      };
    } catch (error) {
      return error.name === jwt.TokenExpiredError.name
        ? JwtExpired
        : InvalidToken;
    }
  }
});
export { FriendResponseTC };
