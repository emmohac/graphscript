import {
  ApplicationTC,
  InterestTC,
  ProjectTC,
  UserExtraTC,
  UserInputTC,
  UserResponseTC,
  ErrorTC
} from "../TypeComposes";
import { projects, applications } from "../Data";
import { ResolverResolveParams } from "graphql-compose";

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
  resolve: async (rp: ResolverResolveParams<any, object, any>) => {
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
  resolve: async (rp: ResolverResolveParams<any, object, any>) => {
    return {
      isAuthenticated: false,
      errors: [{
        code: "non-existed",
        message: "User not exists"
      }]
    };
  }
});

export { UserExtraTC, UserResponseTC };
