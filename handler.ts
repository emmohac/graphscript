import { ApolloServer } from "apollo-server-lambda";
import { Context, APIGatewayProxyEvent, Callback } from "aws-lambda";

import { schema } from "./src/main";
import { mongoConnect } from "./src/Databases";

const server = new ApolloServer({
  schema,
  context: async (_event: APIGatewayProxyEvent, _context: Context) => {
    await mongoConnect();
    return {
      name: "Huy"
    };
  }
});

export const graphqlHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  return server.createHandler()(event, context, callback);
};
