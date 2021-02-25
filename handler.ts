import { ApolloServer } from "apollo-server-lambda";
import { Context, APIGatewayProxyEvent, Callback } from "aws-lambda";

import { schema } from "./src/main";
import { getConnection } from "./src/Databases";

const server = new ApolloServer({
  schema,
  context: async ({ event }: { event: APIGatewayProxyEvent }) => {
    const authorization = event.headers["authorization"];
    const conn = await getConnection();
    return {
      authorization,
      conn
    };
  },
  formatError: (error) => {
    return new Error(`Got error: ${error.message}`);
  }
});

export const graphqlHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
): void => {
  context.callbackWaitsForEmptyEventLoop = false;
  return server.createHandler({
    cors: {
      origin: "*",
      credentials: true
    }
  })(event, context, callback);
};
