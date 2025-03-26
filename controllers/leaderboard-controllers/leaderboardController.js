import handleResponse from "../../middlewares/handleResponse.js";
import leaderboardService from "../../services/leaderboardService.js";

const leaderboardController = {
  async getLeaderboard(req, res, next) {
    try {
      const leaderboard = await leaderboardService.getTopStudents();
      console.log("🚀 ~ getLeaderboard ~ leaderboard:", leaderboard);
      handleResponse(
        res,
        200,
        "Leaderboard Details Fetched Successfully",
        leaderboard
      );
    } catch (error) {
      next(error);
    }
  },
};

export default leaderboardController;
