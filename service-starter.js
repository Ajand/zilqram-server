import UserService from "./services/User/index.js";
import NotificationService from "./services/Notification/index.js";
import NftService from "./services/Nft/index.js";
import FeedService from './services/Feed/index.js'
import MessengerService from './services/Messenger/index.js'

const userService = UserService();
const noitificationService = NotificationService();
const nftService = NftService({userService});
const feedService = FeedService({userService})
const messengerService = MessengerService({userService})


export {
  userService,
  noitificationService,
  nftService,
  feedService,
  messengerService
};

export default [
  userService,
  noitificationService,
  nftService,
  feedService,
  messengerService
];
