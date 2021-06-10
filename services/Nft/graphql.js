import { createModule, gql } from "graphql-modules";
import { __dirname } from "../../util.js";
import keygen from "keygen";
import path from "path";
import fs from "fs";

import { methods as collectionMethods, methods } from "./Collection.js";
import NFTMetaMethods from "./NFTMeta.js";

export const NFTModule = ({ userService }) => {
  const CollectionMapper = (collection) => {
    return {
      ...collection._doc,
      creator: userService.model.methods.queries.get(collection.creator),
    };
  };

  return createModule({
    id: "nftModule",
    dirname: __dirname,
    typeDefs: [
      gql`
        type Collection {
          _id: ID!
          name: String!
          logo: String!
          creator: User
          description: String
          cover: String
          contractAddress: String!
        }

        type MetaProperty {
          trait_type: String!
          value: String!
        }

        type NFTMeta {
          _id: ID!
          name: String!
          description: String
          external_url: String
          properties: [MetaProperty!]!
          image: String!
        }

        extend type Query {
          myNftCollections: [Collection!]!
          nftCollection(_id: ID!): Collection
          collections: [Collection!]!
        }

        extend type Mutation {
          createNftCollection(
            logo: Upload!
            name: String!
            description: String
            contractAddress: String!
          ): Collection!

          updateNftCollectionCover(collectionId: ID!, cover: Upload!): String!
          editNftCollection(
            collectionId: ID!
            logo: Upload!
            description: String
          ): String!

          createMetaProperty(
            _id: ID!
            name: String!
            description: String
            external_url: String
            properties: String
            image: Upload!
          ): String!
        }
      `,
    ],
    resolvers: {
      Query: {
        myNftCollections: (_, __, { userId }) => {
          return collectionMethods.queries
            .getUserCollections(userId)
            .then((colls) => colls.map(CollectionMapper))
            .catch((err) => {
              throw new Error(err);
            });
        },

        nftCollection: (_, { _id }) => {
          return collectionMethods.queries
            .get(_id)
            .then((coll) => CollectionMapper(coll))
            .catch((err) => {
              throw new Error(err);
            });
        },
      },
      Mutation: {
        createNftCollection: (
          _,
          { logo, name, description, contractAddress },
          { userId }
        ) => {
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
                      .create(userId, {
                        logo: filename,
                        name,
                        description,
                        contractAddress,
                      })
                      .then((coll) => resolve(CollectionMapper(coll)))
                      .catch((err) => {
                        console.log(err);
                        return reject(err);
                      });
                  });
              })
              .catch((err) => {
                throw new Error(err);
              });
          });
        },

        updateNftCollectionCover: (_, { cover, collectionId }, { userId }) => {
          const filename = keygen.url(keygen.large);
          const filesDirectory = path.resolve(__dirname, "files");

          if (!fs.existsSync(filesDirectory)) {
            fs.mkdirSync(filesDirectory);
          }
          return new Promise((resolve, reject) => {
            cover.promise
              .then(({ createReadStream }) => {
                createReadStream()
                  .pipe(
                    fs.createWriteStream(path.resolve(filesDirectory, filename))
                  )
                  .on("finish", (result) => {
                    return collectionMethods.commands
                      .updateNftCollectionCover(userId, collectionId, {
                        cover: filename,
                      })
                      .then((msg) => resolve(msg))
                      .catch((err) => {
                        return reject(err);
                      });
                  });
              })
              .catch((err) => {
                throw new Error(err);
              });
          });
        },

        editNftCollection: (
          _,
          { logo, description, collectionId },
          { userId }
        ) => {
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
                      .editCollection(userId, collectionId, {
                        logo: filename,
                        description,
                      })
                      .then((msg) => {
                        return resolve(msg);
                      })
                      .catch((err) => {
                        return reject(err);
                      });
                  });
              })
              .catch((err) => {
                throw new Error(err);
              });
          });
        },

        createMetaProperty: (
          _,
          { _id, name, image, external_url, properties, description },
          { userId }
        ) => {
          const filename = keygen.url(keygen.large);
          const filesDirectory = path.resolve(__dirname, "files");

          if (!fs.existsSync(filesDirectory)) {
            fs.mkdirSync(filesDirectory);
          }
          return new Promise((resolve, reject) => {
            image.promise
              .then(({ createReadStream }) => {
                createReadStream()
                  .pipe(
                    fs.createWriteStream(path.resolve(filesDirectory, filename))
                  )
                  .on("finish", (result) => {
                    return NFTMetaMethods.commands
                      .create({
                        _id,
                        name,
                        image: filename,
                        external_url,
                        properties: JSON.parse(properties),
                        description,
                      })
                      .then((msg) => {
                        return resolve('added');
                      })
                      .catch((err) => {
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
};
export default NFTModule;
