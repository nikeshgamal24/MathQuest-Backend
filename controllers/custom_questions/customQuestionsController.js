// import { addCustomQuestion, getRandomQuestionsByDifficulty } from "../models/questionService.js";

import handleResponse from "../../middlewares/handleResponse.js";
import { addCustomQuestionService } from "../../services/customQuestionServices.js";

// Create a question
export const createQuestion = async (req, res, next) => {
  try {
    const {
      operation,
      difficulty,
      question,
      correct_answer,
      wrong_option1,
      wrong_option2,
      wrong_option3,
    } = req.body;

    const teacher_id = req.userId; // Teacher ID from auth

    const newQuestion = await addCustomQuestionService({
      teacher_id,
      operation,
      difficulty,
      question,
      correct_answer,
      wrong_option1,
      wrong_option2,
      wrong_option3,
    });

    if (!newQuestion) return handleResponse(res, 500, "Failed to add question");

    handleResponse(res, 201, "New Questions Added Successfully", newQuestion);
  } catch (error) {
    next(error);
  }
  console.log("createQuestion  Controller");
  console.log("Req Body", req.body);
};

// // Get random questions by difficulty for playing
// export const playQuestionsByDifficulty = async (req, res, next) => {
//   try {
//     const { difficulty, limit } = req.query;
//     const questions = await getRandomQuestionsByDifficulty(difficulty, limit);
//     res.status(200).json(questions);
//   } catch (error) {
//     next(error);
//   }
// };
