import { GraphQLResolveInfo } from 'graphql';
import { schemaComposer } from 'graphql-compose';

import { userExtra } from '../src/Data/';

import { UserExtraTC } from '../src/Resolvers';

UserExtraTC.addFields({
    interest: UserExtraTC.getResolver('interest'),
    projects: UserExtraTC.getResolver('projects'),
    applications: UserExtraTC.getResolver('applications'),
});

schemaComposer.Query.addFields({
    UserExtra: {
        type: UserExtraTC,
        args: {
            id: 'String'
        },
        resolve: async (_source: any, _args: any, _context: any, _info: GraphQLResolveInfo) => {
            return userExtra;
        }
    },
});

export const schema = schemaComposer.buildSchema();