import { createModule, gql } from "graphql-modules";
import { __dirname } from "../../util.js";

export const TournamentModule = createModule({
  id: "tournamentModule",
  dirname: __dirname,
  typeDefs: [
    gql`
      union Participant = User | Team

      enum ParticipantType {
        USER
        TEAM
      }

      enum TournamentVariant {
        LEAGUE
        SINGLE_ELIMINATION
        DOUBLE_ELIMINATION
        GROUP_AND_KNOCKOUT
      }

      enum RoundType {
        BO1
        BO2
        BO3
        BO5
      }

      enum TournamentStatus {
        DRAFT
        READY
        OPEN
        CLOSE
        FINISHED
      }

      type Tournament {
        participantType: ParticipantType!
        variant: TournamentVariant!
        status: TournamentStatus!
        roundType: RoundType!
        maxParticipants: Int!
        minParticipants: Int!
        fee: Int!
        rewards: [String!]!
        participants: [Participant!]!
      }

      extend type Query {
        hi: String
      }

      extend type Mutation {
        create: Tournament
      }
    `,
  ],
  resolvers: {
    Query: {},
  },
});

export default TournamentModule;
