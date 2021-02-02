import { schemaComposer } from "graphql-compose";

export const ErrorTC = schemaComposer.createObjectTC({
  name: "Error",
  fields: {
    code: "String",
    message: "String"
  }
});

export const UserResponseTC = schemaComposer.createObjectTC({
  name: "UserResponse",
  fields: {
    isRegistered: "Boolean",
    isAuthenticated: "Boolean",
    token: "String",
    errors: {
      type: () => [ErrorTC]
    }
  }
});

export const UserInputTC = schemaComposer.createInputTC({
  name: "UserInput",
  fields: {
    email: "String!",
    password: "String!",
    firstName: "String",
    lastName: "String",
    phoneNumber: "String"
  }
});

export const ApplicationTC = schemaComposer.createInputTC({
  name: "Application",
  fields: {
    companyName: "String",
    applicationDate: "Date"
  }
});

export const ApplicationInputTC = schemaComposer.createInputTC({
  name: "ApplicationInput",
  fields: {
    applications: {
      type: [ApplicationTC]
    }
  }
});

export const ApplicationResponseTC = schemaComposer.createObjectTC({
  name: "ApplicationResponse",
  fields: {
    successful: "Boolean",
    errors: {
      type: () => [ErrorTC]
    }
  }
});
