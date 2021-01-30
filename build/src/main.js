import { schemaComposer } from "graphql-compose";
import { userExtra } from "../src/Data/";
import { UserExtraTC } from "../src/Resolvers";
UserExtraTC.addFields({
    interest: UserExtraTC.getResolver("interest"),
    projects: UserExtraTC.getResolver("projects"),
    applications: UserExtraTC.getResolver("applications")
});
schemaComposer.Query.addFields({
    UserExtra: {
        type: UserExtraTC,
        args: {
            id: "String"
        },
        resolve: async (_source, _args, _context, _info) => {
            return userExtra;
        }
    },
    Hello: {
        type: "String",
        args: {
            content: "String"
        },
        resolve: async (_source, args, _context, _info) => {
            return `Did you just say ${args.content}`;
        }
    }
});
export const schema = schemaComposer.buildSchema();
//# sourceMappingURL=main.js.map