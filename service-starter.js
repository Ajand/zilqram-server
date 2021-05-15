import UserService from "./services/User/index.js";
import NotificationService from "./services/Notification/index.js";
import GameService from "./services/Game/index.js";
import TeamService from "./services/Team/index.js";
import TournomentService from "./services/Tournoment/index.js";

const userService = UserService();
const noitificationService = NotificationService();
const gameService = GameService();
const teamService = TeamService({ userService });
const tournomentService = TournomentService();

export {
  userService,
  noitificationService,
  teamService,
  tournomentService,
  gameService,
};

export default [
  userService,
  noitificationService,
  gameService,
  teamService,
  tournomentService,
];
