import { createModule, gql } from "graphql-modules";
import { __dirname } from "../../util.js";

export const NotificationModule = createModule({
  id: "notificationModule",
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
});

export default NotificationModule;
