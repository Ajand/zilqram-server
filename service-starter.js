import UserService from "./services/User/index.js";
import TournomentService from "./services/Tournoment/index.js";

const userService = UserService();
const tournomentService = TournomentService();

export { userService, tournomentService };

export default [userService, tournomentService];
