import { ResolverResolveParams } from "graphql-compose";
import Joi from "joi";
import jwt from "jsonwebtoken";
import cryptoJS from "crypto";

import { UserInputTC, UserResponseTC, ApplicationInputTC, ApplicationResponseTC } from "../TypeComposes";
import {
  UserNotFoundError,
  DuplicatedUserError,
  InvalidFieldError,
  IncorrectInformation,
  JwtExpired,
  JwtNotProvided,
  InvalidToken
} from "../Errors";
import { UserModel } from "../Models/User";
import { IUser, User } from "../Types";

UserResponseTC.addResolver({
  name: "register",
  args: {
    input: UserInputTC
  },
  type: UserResponseTC,
  resolve: async (_rp: ResolverResolveParams<any, any, any>) => {
    const { input } = _rp.args;
    const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      phoneNumber: Joi.string()
    })
      .with("email", "password")
      .with("firstName", "lastName");

    const valid = schema.validate(input);
    if (valid.error) {
      InvalidFieldError.errors[0].message = valid.error.message;
      return InvalidFieldError;
    }

    const { email, password } = input;
    const response = await UserModel.findOne({ email }, { _id: 1 });

    if (response && response._id) {
      return DuplicatedUserError;
    }

    const hashedPassword = cryptoJS
      .createHash("sha256")
      .update(password)
      .digest("hex");
    input.password = hashedPassword;
    input.applications = [];
    const result = await UserModel.create(input);
    console.log(result);
    return {
      isRegistered: true,
      errors: []
    };
  }
});

UserResponseTC.addResolver({
  name: "login",
  args: {
    input: UserInputTC
  },
  type: UserResponseTC,
  resolve: async (_rp: ResolverResolveParams<any, any, any>) => {
    const { email, password } = _rp.args.input;

    const response = (await UserModel.findOne(
      { email },
      {
        _id: 0,
        password: 1,
        firstName: 1,
        lastName: 1
      }
    )) as IUser;

    if (!response) {
      return UserNotFoundError;
    }

    const { password: userPassword, firstName, lastName } = response;
    const hashedPassword = cryptoJS
      .createHash("sha256")
      .update(password)
      .digest("hex");
    if (hashedPassword !== userPassword) {
      return IncorrectInformation;
    }

    const user = {
      email,
      password: userPassword,
      firstName,
      lastName,
    };
    const token = jwt.sign(user, process.env.SECRET_KEY as string, {
      expiresIn: 180
    });
    return {
      isAuthenticated: true,
      token: `Bearer ${token}`,
      errors: []
    };
  }
});

ApplicationResponseTC.addResolver({
  name: "add_application",
  args: {
    input: ApplicationInputTC
  },
  type: ApplicationResponseTC,
  resolve: async (rp: ResolverResolveParams<any, any, any>) => {
    const { authorization } : { authorization: string }= rp.context;
    if (!authorization) {
      return JwtNotProvided;
    }

    try {
      const result = jwt.verify(authorization.slice(7), process.env.SECRET_KEY as string) as User;
      const { email } = result;
      const inputApplication = rp.args.input.applications;
      const response = await UserModel.findOneAndUpdate({ email }, { $addToSet: { applications: { $each: inputApplication }}});
      console.log('response');
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
    }
  }
});

ApplicationResponseTC.addResolver({
  name: "remove_application",
  args: {
    input: ApplicationInputTC,
  },
  type: ApplicationResponseTC,
  resolve: async (rp: ResolverResolveParams<any, any, any>) => {
    const { authorization } : { authorization: string } = rp.context;
    if (!authorization) {
      return JwtNotProvided;
    }

    try {
      const result = jwt.verify(authorization.slice(7), process.env.SECRET_KEY as string) as User;
      const { email } = result;
      const toRemove = rp.args.input.applications;
      const response = await UserModel.findOneAndUpdate({ email }, { $pullAll: { applications: toRemove }});
      console.log(response);
    } catch(error) {
      if (error.name === jwt.TokenExpiredError.name) {
        return JwtExpired;
      }
      return InvalidToken;
    }
    return {
      successful: true,
      errors: []
    }
  }
})
export { UserResponseTC, ApplicationResponseTC };
