import graphqlModule from "./graphql.js";

const FeedService = ({ userService }) => {
  return {
    graphqlModule: graphqlModule({ userService }),
  };
};

export default FeedService;
