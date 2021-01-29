import {
  ApplicationTC,
  InterestTC,
  ProjectTC,
  UserExtraTC
} from "../TypeComposes";
import { projects, applications } from "../Data";

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

export { UserExtraTC };
