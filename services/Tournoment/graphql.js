import { createModule, gql } from "graphql-modules";
import { __dirname } from "../../util.js";

export const TournomentModule = createModule({
  id: "tournomentModule",
  dirname: __dirname,
  typeDefs: [
    gql`
      extend type Query {
        hi: String
      }
    `,
  ],
  resolvers: {
    Query: {},
  },
});

export default TournomentModule;
