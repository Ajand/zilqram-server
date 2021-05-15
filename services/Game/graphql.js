import { createModule, gql } from "graphql-modules";
import { __dirname } from "../../util.js";

export const GameModule = createModule({
  id: "gameModule",
  dirname: __dirname,
  typeDefs: [
    gql`
      type LeaderBoard {
        user: User!
        point: Int!
        rank: Int!
      }

      type Game {
        name: String!
        identifier: String!
        logo: String!
        pics: [String!]!
        info: String!
        leaderboard(limit: Int!): [LeaderBoard!]!
      }

      input gameInput {
        name: String
        identifier: String
        logo: Upload
        pics: [Upload!]!
      }

      extend type Mutation {
        # All Game mutations can only be done with admin permission
        createGame(game: gameInput!): Game!
        editGame(game: gameInput!): String!
        deleteGame(gameId: gameInput!): String!

        updateLeaderBoard(username: ID!, point: Int!): String!
      }
    `,
  ],
  resolvers: {
    Query: {},
  },
});

export default GameModule;
