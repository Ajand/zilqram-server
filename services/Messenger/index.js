import graphqlModule from "./graphql.js";

const MessengerService = ({ userService }) => {
  return {
    graphqlModule: graphqlModule({ userService }),
  };
};

export default MessengerService;
