import { createModule, gql } from "graphql-modules";
import { __dirname } from "../../util.js";

export const TeamModule = createModule({
  id: "teamModule",
  dirname: __dirname,
  typeDefs: [
    gql`
      type MemberWithRole {
        user: User!
        rights: [String!]!
        role: String!
        captain: Boolean!
        owner: Boolean!
      }

      type Team {
        owner: User!
        members: [MemberWithRole!]!
        info: String
        logo: String
        name: String!
        identifier: String!
      }

      type UserTeamRole {
        team: Team!
        role: String!
        captain: Boolean!
        owner: Boolean!
      }

      extend type User {
        teams: [UserTeamRole!]!
      }

      extend type Query {
        team(_id: ID!): Team!
        teams: [Team!]!
      }

      input TeamInfoInput {
        info: String
        logo: String
        name: String!
        identifier: String!
      }

      extend type Mutation {
        createTeam(identifier: ID!, name: String!): Team!
        changeTeamInfo(teamInfo: TeamInfoInput!): String!

        sendMembershipInvitation(teamId: ID!, memberId: ID!): String! # Only members with invite permission can
        cancelMembershipInvitation(invitation: ID!): String! # Only members with invite permission can
        acceptMembershipInvitation(invitation: ID!): String! # Only the invited users can accept, cancel
        rejectMembershipInvitation(invitation: ID!): String! # Only the invited users can accept, cancel
      }
    `,
  ],
  resolvers: {
    Query: {},
  },
});

export default TeamModule;
