import { ApplicationTC, InterestTC, ProjectTC, UserExtraTC } from "../TypeComposes";
import { projects, applications } from "../Data";
UserExtraTC.addResolver({
    name: "applications",
    type: [ApplicationTC],
    resolve: async (_params) => {
        return applications;
    }
});
UserExtraTC.addResolver({
    name: "interest",
    type: InterestTC,
    resolve: async (_params) => {
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
    resolve: async (_params) => {
        return projects;
    }
});
export { UserExtraTC };
//# sourceMappingURL=index.js.map