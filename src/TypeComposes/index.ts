import { schemaComposer } from 'graphql-compose';

export const ApplicationTC = schemaComposer.createObjectTC({
    name: 'Application',
    fields: {
        id: 'String!',
        companyName: 'String',
        dateApplied: 'Date'
    }
});

export const InterestTC = schemaComposer.createObjectTC({
    name: 'Interest',
    fields: {
        programmingLanguage: 'String',
        technologies: 'String',
        food: 'String',
        drink: 'String'
    }
});

export const ProjectTC = schemaComposer.createObjectTC({
    name: 'Project',
    fields: {
        projectName: 'String',
        url: 'String'
    }
});

export const UserExtraTC = schemaComposer.createObjectTC({
    name: 'UserExtra',
    fields: {
        id: 'String!',
        firstName: 'String',
        lastName: 'String',
        degree: 'String',
        major: 'String',
        graduation: 'String',
    }
});

