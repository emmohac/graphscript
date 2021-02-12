import { ResolverResolveParams } from "graphql-compose";
import jwt from "jsonwebtoken";

import { ApplicationInputTC, ApplicationResponseTC } from "../TypeComposes";
import { JwtExpired, JwtNotProvided, InvalidToken } from "../Errors";
import { UserModel } from "../Models/User";
import { IUser, User } from "../Types";

ApplicationResponseTC.addResolver({
  name: "add_application",
  args: {
    input: ApplicationInputTC
  },
  type: ApplicationResponseTC,
  resolve: async (rp: ResolverResolveParams<any, any, any>) => {
    const { authorization }: { authorization: string } = rp.context;
    if (!authorization) {
      return JwtNotProvided;
    }

    try {
      const result = jwt.verify(
        authorization.slice(7),
        process.env.SECRET_KEY as string
      ) as User;
      const { email } = result;
      const inputApplication = rp.args.input.applications;
      const response = await UserModel.findOneAndUpdate(
        { email },
        { $addToSet: { applications: { $each: inputApplication } } }
      );
      console.log(response);
    } catch (error) {
      if (error.name === jwt.TokenExpiredError.name) {
        return JwtExpired;
      }
      return InvalidToken;
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
  resolve: async (rp: ResolverResolveParams<any, any, any>) => {
    const { authorization }: { authorization: string } = rp.context;
    if (!authorization) {
      return JwtNotProvided;
    }

    try {
      const result = jwt.verify(
        authorization.slice(7),
        process.env.SECRET_KEY as string
      ) as User;
      const { email } = result;
      const toRemove = rp.args.input.applications;
      const response = await UserModel.findOneAndUpdate(
        { email },
        { $pullAll: { applications: toRemove } }
      );
      console.log(response);
    } catch (error) {
      if (error.name === jwt.TokenExpiredError.name) {
        return JwtExpired;
      }
      return InvalidToken;
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
  resolve: async (rp: ResolverResolveParams<any, any, any>) => {
    const { authorization }: { authorization: string } = rp.context;
    if (!authorization) {
      return JwtNotProvided;
    }
    try {
      const result = jwt.verify(
        authorization.slice(7),
        process.env.SECRET_KEY as string
      ) as User;
      const { email } = result;
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
      if (error.name === jwt.TokenExpiredError.name) {
        return JwtExpired;
      }
      return InvalidToken;
    }
  }
});

export { ApplicationResponseTC };
