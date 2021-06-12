import { createModule, gql } from "graphql-modules";
import { __dirname } from "../../util.js";
import keygen from "keygen";
import path from "path";
import fs from "fs";

import Tier from "./Tiers.js";
import Content from "./Content.js";
import Comment from './Comments.js'

export const FeedModule = ({ userService }) => {
  const TierMapper = (tier) => {
    return {
      ...tier._doc,
      owner: userService.model.methods.queries.get(tier.owner),
    };
  };

  const ContentMapper = (content) => {
    return {
      ...content._doc,
      owner: userService.model.methods.queries.get(content.owner),
    };
  };

  const CommentMapper = (comment) => {
    return {
      ...comment._doc,
      owner: userService.model.methods.queries.get(comment.owner),
    };
  };

  return createModule({
    id: "feedModule",
    dirname: __dirname,
    typeDefs: [
      gql`
        type Tier {
          _id: ID!
          title: String!
          description: String!
          benefits: [String]
          icon: String
          owner: User
          createdAt: String

        }

        type Content {
          _id: ID!
          body: String!
          exclusive: Boolean!
          variant: String!
          owner: User
          likes: Int!
          likers: [String]
          createdAt: String

        }

        type Comment {
          _id: ID!
          owner: User
          body: String!
          belongsTo: String!
          createdAt: String
        }

        extend type Query {
          getTier(id: ID!): Tier
          getTiersOfOwner(userId: ID!): [Tier]
          myTiers: [Tier]

          userContents(userId: ID!): [Content]
          myContents: [Content]
          contents: [Content]
          content(_id: ID!): Content

          comments(belongsTo: ID!): [Comment]
        }

        extend type Mutation {
          createTier(
            title: String!
            description: String!
            benefits: [String]
            icon: String
          ): Tier!
          removeTier(_id: ID!): String!

          createContent(
            variant: String!
            body: String!
            image: Upload
            exclusive: Boolean!
          ): Content!
          removeContent(_id: ID!): String!
          likeContent(_id: ID!): String!

          createComment(body: String!, belongsTo: ID!): Comment!
          removeComment(_id: ID!): String
        }
      `,
    ],
    resolvers: {
      Query: {
        getTier: (_, { _id }) => {
          return Tier.queries
            .get(_id)
            .then((tier) => TierMapper(tier))
            .catch((err) => {
              throw new Error(err);
            });
        },

        getTiersOfOwner: (_, { userId }) => {
          return Tier.queries
            .getOfOwner(userId)
            .then((tiers) => tiers.map(TierMapper))
            .catch((err) => {
              throw new Error(err);
            });
        },

        myTiers: (_, __, { userId }) => {
          return Tier.queries
            .getOfOwner(userId)
            .then((tiers) => tiers.map(TierMapper))
            .catch((err) => {
              throw new Error(err);
            });
        },

        userContents: (_, { userId }) => {
          return Content.queries
            .getOfOwner(userId)
            .then((contents) => contents.map(ContentMapper))
            .catch((err) => {
              throw new Error(err);
            });
        },

        myContents: (_, __, { userId }) => {
          return Content.queries
            .getOfOwner(userId)
            .then((contents) => contents.map(ContentMapper))
            .catch((err) => {
              throw new Error(err);
            });
        },

        comments: (_, {belongsTo}) => {
          return Comment.queries
            .commentsOf(belongsTo)
            .then((comments) => comments.map(CommentMapper))
            .catch((err) => {
              throw new Error(err);
            });
        }
      },

      Mutation: {
        createTier: (_, { title, description, benefits, icon }, { userId }) => {
          return Tier.commands
            .create(userId, { title, description, benefits, icon })
            .then((tier) => TierMapper(tier))
            .catch((err) => {
              throw new Error(err);
            });
        },

        removeTier: (_, { _id }, { userId }) => {
          return Tier.commands
            .remove(_id)
            .then((msg) => msg)
            .catch((err) => {
              throw new Error(err);
            });
        },

        createContent: (_, { variant, body, image, exclusive }, { userId }) => {
          if (variant == "zweet") {
            return Content.commands
              .create(userId, { variant, body, exclusive })
              .then((content) => ContentMapper(content))
              .catch((err) => {
                throw new Error(err);
              });
          } else {
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
                      fs.createWriteStream(
                        path.resolve(filesDirectory, filename)
                      )
                    )
                    .on("finish", (result) => {
                      return Content.commands
                        .create(userId, { variant, body: filename, exclusive })
                        .then((content) => resolve(ContentMapper(content)))
                        .catch((err) => {
                          return reject(err);
                        });
                    });
                })
                .catch((err) => {
                  throw new Error(err);
                });
            });
          }
        },

        likeContent: (_, { _id }, { userId }) => {
          if (!userId) throw new Error("Login First!");
          return Content.commands
            .like(_id, userId)
            .then((msg) => msg)
            .catch((err) => {
              throw new Error(err);
            });
        },

        createComment: (_, {body, belongsTo}, {userId}) => {
          return Comment.commands
            .create(userId, { body, belongsTo })
            .then((tier) => CommentMapper(tier))
            .catch((err) => {
              throw new Error(err);
            });
        },

        removeComment: (_, {_id}, {userId}) => {
          return Comment.commands
            .remove(_id)
            .then((msg) => msg)
            .catch((err) => {
              throw new Error(err);
            });
        }
      },
    },
  });
};

export default FeedModule;
