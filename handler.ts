import {  ApolloServer, gql } from 'apollo-server-lambda';
import 'source-map-support/register';


const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

export const graphqlHandler = server.createHandler();
