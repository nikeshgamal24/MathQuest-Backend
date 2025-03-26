import express from "express";
import leaderboardController from "../../controllers/leaderboard-controllers/leaderboardController.js";

const router = express.Router();

router.get("/", leaderboardController.getLeaderboard);

export default router;