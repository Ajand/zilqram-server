import dotEnv from "dotenv";
dotEnv.config();

import { ApolloServer } from "apollo-server";
import application from "./graphql-application.js";
import "./dbConnector.js";


const schema = application.createSchemaForApollo();

const server = new ApolloServer({
  schema,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
