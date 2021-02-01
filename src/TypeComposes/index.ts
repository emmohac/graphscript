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
    lastName: "String"
  }
});
