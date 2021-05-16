import { createModule, gql } from "graphql-modules";
import { __dirname } from "../../util.js";

export const UserModule = createModule({
  id: "userModule",
  dirname: __dirname,
  typeDefs: [
    gql`
      scalar Upload


      type PersonalInfo {
        firstName: String
        lastName: String
        birthDay: String
        avatar: String
        bio: String
        setted: Boolean!
      }

      type User {
        _id: ID!
        email: String!
        username: String!
        verified: Boolean!
        personal: PersonalInfo
        createdAt: String!
        updatedAt: String!
      }

      type Query {
        me: User
        user(_id: ID!): User
        users: [User!]!
      }

      input UserCreationInput {
        email: String!
        password: String!
        username: String!
      }

      input PersonalInfoInput {
        firstName: String
        lastName: String
        birthDay: String
        avatar: Upload
        bio: String
      }

      type Mutation {
        signup(user: UserCreationInput): String!
        singin(identifier: String!, password: String!): String!
        requestResetPasswordKey(identifier: String!): String!
        resetPassword(identifier: String!, key: String!, password: String!): String!
        changePassword(password: String!): String!
        editPersonalInfo(personalInfo: PersonalInfoInput!): String!

        doesUsernameExist(username: String!): Boolean!
        doesEmailExist(email: String!): Boolean!
      }
    `,
  ],
  resolvers: {
    Query: {
    },
  },
});


export default UserModule