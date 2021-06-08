import graphqlModule from "./graphql.js";

const NFTService = ({ userService }) => {
  return {
    graphqlModule: graphqlModule({ userService }),
  };
};

export default NFTService;
