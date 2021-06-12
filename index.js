import dotEnv from "dotenv";
dotEnv.config();
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import path from "path";
import jwt from "jsonwebtoken";
import cors from 'cors'

import application from "./graphql-application.js";
import "./dbConnector.js";
import NFTMethods from "./services/Nft/NFTMeta.js";
import { __dirname } from "./util.js";

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
app.use(cors())

app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })
);
server.applyMiddleware({ app });

const SERVER_ADDRESS = 'http://localhost:4000'
app.get("/nft-address/:nft_id", (req, res, next) => {
  return NFTMethods.queries
    .get(req.params.nft_id)
    .then((meta) => res.json({...meta._doc, image: `${SERVER_ADDRESS}/files/${meta.image}`}))
    .catch((err) => next(err));
});

app.use("/files", express.static(path.resolve(__dirname, "files")));

await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
