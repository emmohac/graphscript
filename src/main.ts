import { GraphQLResolveInfo } from 'graphql';
import { schemaComposer } from 'graphql-compose';
import { MenteeTC, MentorTC } from './TypeDefs';

const mentee = {
    id: "123",
    firstName: "Huy Minh",
    lastName: "Tran"
};

const mentor = {
    id: "456",
    firstName: "Daniel",
    lastName: "Morningstar"
};

MentorTC.addFields({
    mentees: {
        type: [MenteeTC],
        resolve: async (_source: any, _args, _context, _info: GraphQLResolveInfo) => {
            return [mentee];
        }
    }
});

MenteeTC.addFields({
    mentor: {
        type: MentorTC,
        resolve: async (_source: any, _args, _context, _info: GraphQLResolveInfo) => {
            return mentor;
        }
    }
});

schemaComposer.Query.addFields({
    Mentee: {
        type: [MenteeTC],
        resolve: async (_source: any, _args, _context, _info: GraphQLResolveInfo) => {
            return [mentee];            
        }
    },
    Mentor: {
        type: MentorTC,
        resolve: async (_source: any, _args, _context, _info: GraphQLResolveInfo) => {
            return mentor;            
        }
    }
});

export const schema = schemaComposer.buildSchema();