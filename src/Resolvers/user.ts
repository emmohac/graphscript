import Joi from "joi";
import jwt from "jsonwebtoken";
import cryptoJS from "crypto";

import { UserInputTC, UserResponseTC } from "../TypeComposes";
import {
  UserNotFoundError,
  DuplicatedUserError,
  InvalidFieldError,
  IncorrectInformation
} from "../Errors";
import { userSchema } from "../Models/User";
import { IUser, Ctx } from "../Types";

UserResponseTC.addResolver({
  name: "register",
  args: {
    input: UserInputTC
  },
  type: UserResponseTC,
  resolve: async ({ args, context }: { args: any; context: Ctx }) => {
    const { input } = args;
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
    const { conn } = context;
    const UserModel = conn.model("user", userSchema);
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
    input.friends = [];
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
  resolve: async ({ args, context }: { args: any; context: Ctx }) => {
    const { email, password } = args.input;
    const { conn } = context;
    const UserModel = conn.model("user", userSchema);
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
      lastName
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

export { UserResponseTC };
