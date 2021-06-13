import { createModule, gql } from "graphql-modules";
import { __dirname } from "../../util.js";

export const MessengerModule = ({ userService }) => {
  return createModule({
    id: "messengerModule",
    dirname: __dirname,
    typeDefs: [
      gql`
        extend type Query {
          messages: String!
        }
      `,
    ],
    resolvers: {
      Query: {},
    },
  });
};

export default MessengerModule;
