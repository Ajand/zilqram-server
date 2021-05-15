import { createModule, gql } from "graphql-modules";
import { __dirname } from "../../util.js";

export const UserModule = createModule({
  id: "my-module",
  dirname: __dirname,
  typeDefs: [
    gql`
      type Query {
        hello: String!
      }
    `,
  ],
  resolvers: {
    Query: {
      hello: () => "world",
    },
  },
});


export default UserModule