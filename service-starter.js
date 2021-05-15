import UserService from "./services/User/index.js";
import TeamService from "./services/Team/index.js";
import TournomentService from "./services/Tournoment/index.js";

const userService = UserService();
const teamService = TeamService({ userService });
const tournomentService = TournomentService();

export { userService, teamService, tournomentService };

export default [userService, teamService, tournomentService];
