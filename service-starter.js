import UserService from "./services/User/index.js";
import NotificationService from "./services/Notification/index.js";
import GameService from "./services/Game/index.js";
import TeamService from "./services/Team/index.js";
import TournamentService from "./services/Tournament/index.js";

const userService = UserService();
const noitificationService = NotificationService();
const gameService = GameService();
const teamService = TeamService({ userService });
const tournamentService = TournamentService();

export {
  userService,
  noitificationService,
  teamService,
  tournamentService,
  gameService,
};

export default [
  userService,
  noitificationService,
  gameService,
  teamService,
  tournamentService,
];
