import UserService from "./services/User/index.js";
import GameService from "./services/Game/index.js";
import TeamService from "./services/Team/index.js";
import TournomentService from "./services/Tournoment/index.js";

const userService = UserService();
const gameService = GameService();
const teamService = TeamService({ userService });
const tournomentService = TournomentService();

export { userService, teamService, tournomentService, gameService };

export default [userService, gameService, teamService, tournomentService];
