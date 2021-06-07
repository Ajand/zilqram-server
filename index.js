import dotEnv from "dotenv";
dotEnv.config();
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";

import jwt from "jsonwebtoken";

import application from "./graphql-application.js";
import "./dbConnector.js";
import { methods } from "./services/User/model.js";

const schema = application.createSchemaForApollo();

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization || "";

    if (!token) return {};

    // Try to retrieve a user with the token

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decode._id;

    return { userId };
  },
  uploads: false,
});

//const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

const app = express();
app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })
);
server.applyMiddleware({ app });

await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
