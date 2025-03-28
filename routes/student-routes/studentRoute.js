import express from "express";
import verifyJWT from "../../middlewares/verifyJWT.js";
import {
  answerQuestion,
  endQuiz,
  getQuestionsToPlay,
  getStudentAnswers,
  startQuiz,
} from "../../controllers/quizz-controllers/quizController.js";

const router = express.Router();

router.get("/quizzes/start", verifyJWT, startQuiz);
router.get("/quizzes/questions", verifyJWT, getQuestionsToPlay);
router.post("/quizzes/answer", verifyJWT, answerQuestion);
router.get("/quizzes/end/:sessionId", verifyJWT, endQuiz);
router.get("/quizzes/answers", verifyJWT, getStudentAnswers);

export default router;
