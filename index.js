import dotEnv from "dotenv";
dotEnv.config();

import { ApolloServer } from "apollo-server";
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
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
