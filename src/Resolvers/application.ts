import jwt from "jsonwebtoken";

import { ApplicationInputTC, ApplicationResponseTC } from "../TypeComposes";
import { JwtExpired, JwtNotProvided, InvalidToken } from "../Errors";
import { userSchema } from "../Models/User";
import { IUser, User, Ctx } from "../Types";

ApplicationResponseTC.addResolver({
  name: "add_application",
  args: {
    input: ApplicationInputTC
  },
  type: ApplicationResponseTC,
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
      const { email } = result;
      const inputApplication = args.input.applications;
      const { conn } = context;
      const UserModel = conn.model("user", userSchema);
      const response = await UserModel.findOneAndUpdate(
        { email },
        { $addToSet: { applications: { $each: inputApplication } } }
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

ApplicationResponseTC.addResolver({
  name: "remove_application",
  args: {
    input: ApplicationInputTC
  },
  type: ApplicationResponseTC,
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
      const { email } = result;
      const toRemove = args.input.applications;
      const { conn } = context;
      const UserModel = conn.model("user", userSchema);
      const response = await UserModel.findOneAndUpdate(
        { email },
        { $pullAll: { applications: toRemove } }
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

ApplicationResponseTC.addResolver({
  name: "get_applications",
  type: ApplicationResponseTC,
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
        { _id: 0, applications: 1 }
      )) as IUser;
      console.log(response);
      return {
        successful: true,
        items: response.applications,
        errors: []
      };
    } catch (error) {
      return error.name === jwt.TokenExpiredError.name
        ? JwtExpired
        : InvalidToken;
    }
  }
});

export { ApplicationResponseTC };
