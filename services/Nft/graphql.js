import { createModule, gql } from "graphql-modules";
import { __dirname } from "../../util.js";
import keygen from "keygen";
import path from "path";
import fs from "fs";

import { methods as collectionMethods } from "./Collection.js";

export const NFTModule = createModule({
  id: "nftModule",
  dirname: __dirname,
  typeDefs: [
    gql`
      type Collection {
        _id: ID!
        name: String
        logo: String!
      }

      extend type Query {
        myCollections: [Collection!]!
        collection(_id: ID!): Collection
        collections: [Collection!]!
      }

      extend type Mutation {
        createNftCollection(
          logo: Upload!
          name: String!
          description: String
        ): Collection!
      }
    `,
  ],
  resolvers: {
    Query: {
      myCollections: (_, __, {userId}) => {

      }
    },
    Mutation: {
      createNftCollection: (_, { logo, name, description }, {userId}) => {
        const filename = keygen.url(keygen.large);
        const filesDirectory = path.resolve(__dirname, "files");

        if (!fs.existsSync(filesDirectory)) {
          fs.mkdirSync(filesDirectory);
        }
        return new Promise((resolve, reject) => {
          logo.promise
            .then(({ createReadStream }) => {
              createReadStream()
                .pipe(
                  fs.createWriteStream(path.resolve(filesDirectory, filename))
                )
                .on("finish", (result) => {
                  return collectionMethods.commands
                    .create(userId, { logo: filename, name, description })
                    .then((coll) => resolve(coll))
                    .catch((err) => {
                      console.log(err)
                      return reject(err);
                    });
                });
            })
            .catch((err) => {
              throw new Error(err);
            });
        });
      },
    },
  },
});

export default NFTModule;
