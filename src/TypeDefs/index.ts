import { schemaComposer } from 'graphql-compose';

export const MentorTC = schemaComposer.createObjectTC({
    name: 'Mentor',
    fields: {
        id: 'String!',
        firstName: 'String',
        lastName: 'String'
    }
});

export const MenteeTC = schemaComposer.createObjectTC({
    name: 'Mentee',
    fields: {
        id: 'String!',
        firstName: 'String',
        lastName: 'String'
    }
});