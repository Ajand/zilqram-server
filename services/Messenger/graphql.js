import { createModule, gql } from "graphql-modules";
import { __dirname } from "../../util.js";

export const MessengerModule = ({userService}) => {createModule({
  id: "messengerModue",
  dirname: __dirname,
  typeDefs: [
    gql`
      extend type Query {
        notifications: String!
      }
    `,
  ],
  resolvers: {
    Query: {},
  },
})};

export default MessengerModule;
