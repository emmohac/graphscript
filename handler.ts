import { ApolloServer } from "apollo-server-lambda";
import { Context, APIGatewayProxyEvent, Callback } from "aws-lambda";

import { schema } from "./src/main";
import { mongoConnect } from "./src/Databases";

console.log("Environment");
console.log(process.env);
console.log(process.env.SECRET_KEY);
const server = new ApolloServer({
  schema,
  context: async ({ event }: { event: APIGatewayProxyEvent }) => {
    await mongoConnect();
    const authorization = event.headers["authorization"];

    return {
      event,
      authorization
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
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return server.createHandler()(event, context, callback);
};
