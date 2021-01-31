import { ResolverResolveParams } from "graphql-compose";
import { Document } from "mongoose";
import {
  ApplicationTC,
  InterestTC,
  ProjectTC,
  UserExtraTC,
  UserInputTC,
  UserResponseTC,
  // ErrorTC
} from "../TypeComposes";
import { projects, applications } from "../Data";
import { UserModel } from "../Models/User";
import { IUser } from "../Types";

UserExtraTC.addResolver({
  name: "applications",
  type: [ApplicationTC],
  resolve: async (_params: any) => {
    return applications;
  }
});

UserExtraTC.addResolver({
  name: "interest",
  type: InterestTC,
  resolve: async (_params: any) => {
    // console.log('params from interest');
    // console.log(params);
    return {
      programmingLanguage: "C++;JavaScript;TypeScript;Python;Java",
      technologies: "Serverless;Unix;Agile/Scrum;Git;GraphQL;REST",
      food: "Vietnamese food",
      drink: "Vietnamese coffee"
    };
  }
});

UserExtraTC.addResolver({
  name: "projects",
  type: [ProjectTC],
  resolve: async (_params: any) => {
    return projects;
  }
});

UserResponseTC.addResolver({
  name: "register",
  args: {
    input: UserInputTC
  },
  type: UserResponseTC,
  resolve: async (_rp: ResolverResolveParams<any, any, any>) => {
    const input = _rp.args.input;
    console.log(input);
    // validate using regex too
    const user = {
      ...input
    };
    const response = await UserModel.create(user);
    console.log(response);
    return {
      isRegistered: true,
      errors: []
    }
  }
});

UserResponseTC.addResolver({
  name: "login",
  args: {
    input: UserInputTC
  },
  type: UserResponseTC,
  resolve: async (_rp: ResolverResolveParams<any, object, any>) => {
    const { username, password } = _rp.args.input;
    const response = await UserModel.findOne({ username }, {
      _id: 0,
      password: 1
    }) as IUser;

    if (!response) {
      return {
        isAuthenticated: false,
        errors: [{
          code: "non-existed",
          message: "User not exists"
        }]
      };
    }
    
    // hash and compare?
    const dbPassword = response.password;

    return {
      isAuthenticated: true,
      errors: []
    };
  }
});

export { UserExtraTC, UserResponseTC };
