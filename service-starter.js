import UserService from "./services/User/index.js";
import NotificationService from "./services/Notification/index.js";
import NftService from "./services/Nft/index.js";

const userService = UserService();
const noitificationService = NotificationService();
const nftService = NftService({userService});

export {
  userService,
  noitificationService,
  nftService,
};

export default [
  userService,
  noitificationService,
  nftService,
];
