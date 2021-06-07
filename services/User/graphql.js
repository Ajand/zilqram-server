import { createModule, gql } from "graphql-modules";
import jwt from "jsonwebtoken";
import { getAddressFromPublicKey } from "@zilliqa-js/crypto";
import keygen from "keygen";
import path from "path";
import fs from "fs";

import { __dirname } from "../../util.js";
import { methods, User } from "./model.js";
import isVerifiedSign from "./Authentication/isVerifiedSign.js";

export const UserModule = createModule({
  id: "userModule",
  dirname: __dirname,
  typeDefs: [
    gql`
      scalar Upload

      type User {
        _id: ID!
        username: String
        displayName: String
        avatar: String
        bio: String
        setted: Boolean!
        createdAt: String!
        updatedAt: String!
        addresses: [String!]!
        nounce: String!
      }

      type Query {
        me: User
        user(_id: ID!): User
        users: [User!]!
      }

      input PersonalInfoInput {
        displayName: String!
        avatar: Upload
        bio: String
      }

      type Mutation {
        getNounce(address: String!): String!
        getToken(
          address: String!
          signedMessage: String!
          publicKey: String!
        ): String!

        completeProfile(
          avatar: Upload
          displayName: String!
          username: String!
          bio: String
        ): String!

        editPersonalInfo(personalInfo: PersonalInfoInput!): String!
        doesUsernameExist(username: String!): Boolean!
        setUsername(username: String!): String!
      }
    `,
  ],
  resolvers: {
    Query: {
      me: (_, __, { userId }) => {
        if (!userId) return null;
        return methods.queries
          .get(userId)
          .then((user) => user)
          .catch((err) => {
            throw new Error(err);
          });
      },
    },

    Mutation: {
      getNounce: (_, { address }, { userId }) => {
        return methods.queries
          .getUserByAddress(address)
          .then((user) => user)
          .catch(() => {
            return methods.commands.create(address);
          })
          .then((user) => {
            return user.nounce;
          })
          .catch((err) => {
            throw new Error(err);
          });
      },

      getToken: (_, { address, signedMessage, publicKey }) => {
        return methods.queries
          .getUserByAddress(address)
          .then((user) => {
            const matchedAddress = user.addresses.find(
              (address) =>
                address === String(getAddressFromPublicKey(publicKey))
            );
            if (matchedAddress) {
              if (
                isVerifiedSign({
                  message: user.nounce,
                  publicKey,
                  signature: signedMessage,
                })
              ) {
                // Generate JWT
                return jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
              } else {
                throw new Error("Sign does not match.");
              }
            } else {
              throw new Error(
                "There is no address that match with public key."
              );
            }
          })
          .catch((err) => {
            console.log(err);
            throw new Error(err);
          });
      },

      completeProfile: (
        _,
        { avatar, displayName, username, bio },
        { userId }
      ) => {
        const filename = keygen.url(keygen.large);
        const filesDirectory = path.resolve(__dirname, "files");

        if (!fs.existsSync(filesDirectory)) {
          fs.mkdirSync(filesDirectory);
        }
        return new Promise((resolve, reject) => {
          avatar.promise
            .then(({ createReadStream }) => {
              createReadStream()
                .pipe(
                  fs.createWriteStream(path.resolve(filesDirectory, filename))
                )
                .on("finish", (result) => {
                  methods.commands
                    .completeProfile(userId, {
                      avatar: filename,
                      displayName,
                      username,
                      bio,
                    })
                    .then((msg) => resolve(msg))
                    .catch((err) => {
                      throw new Error(err);
                    });
                });
            })
            .catch((err) => {
              console.log(err);
              throw new Error(err);
            });
        });
      },
    },
  },
});

export default UserModule;
