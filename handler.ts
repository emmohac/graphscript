import { ApolloServer } from "apollo-server-lambda";
import { Context, APIGatewayProxyEvent, Callback } from "aws-lambda";

import { schema } from "./src/main";

const server = new ApolloServer({ schema });

export const graphqlHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  return server.createHandler()(event, context, callback);
};
