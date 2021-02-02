import { ApolloServer } from "apollo-server-lambda";
import { Context, APIGatewayProxyEvent, Callback } from "aws-lambda";

import { schema } from "./src/main";
import { mongoConnect } from "./src/Databases";

const server = new ApolloServer({
  schema,
  context: async ({
    event,
  }: {
    event: APIGatewayProxyEvent;
  }) => {
    await mongoConnect();
    
    return {
      authorization: event.headers["authorization"],
    };
  },
  formatError: (error) => {
    return new Error(`Got error: ${error.message}`);
  },
});

export const graphqlHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  return server.createHandler()(event, context, callback);
};
