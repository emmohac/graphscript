import { ApolloServer } from 'apollo-server';
import { schema } from "./main";

const server:ApolloServer = new ApolloServer({ schema });

server.listen({ port: process.env.PORT || 3000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
