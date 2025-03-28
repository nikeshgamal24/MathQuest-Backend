import handleResponse from "../../middlewares/handleResponse.js";
import {
  endQuizSession,
  getAnsweredQuestions,
  getUnansweredQuestions,
  recordStudentAnswer,
  startQuizSession,
} from "../../services/quizServices.js";

// Start a quiz session
export const startQuiz = async (req, res, next) => {
  try {
    const studentRollNumber = req.userId;
    console.log("🚀 ~ startQuiz ~ studentRollNumber:", studentRollNumber);
    const sessionId = await startQuizSession(studentRollNumber);
    console.log("🚀 ~ startQuiz ~ sessionId:", sessionId);
    res.status(201).json({ sessionId });
  } catch (error) {
    next(error);
  }
};

// Record student answer
export const answerQuestion = async (req, res, next) => {
  try {
    const { sessionId, answers } = req.body;
    const studentRollNumber = req.userId;

    if (
      !sessionId ||
      !answers ||
      !Array.isArray(answers) ||
      answers.length === 0
    ) {
      return handleResponse(
        res,
        400,
        "Invalid request body. Answers array is missing or empty."
      );
    }

    const result = await recordStudentAnswer(
      sessionId,
      studentRollNumber,
      answers
    );

    if (!result) {
      return handleResponse(res, 500, "Failed to record student answers.");
    }

    return handleResponse(res, 200, "Answers successfully submitted.");
  } catch (error) {
    next(error);
  }
};

// End quiz session
export const endQuiz = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const score = await endQuizSession(sessionId);
    res.status(200).json({ score });
  } catch (error) {
    next(error);
  }
};

// Get unanswered questions
export const getQuestionsToPlay = async (req, res, next) => {
  try {
    console.log("getQuestionsToPlay Handler");
    const studentRollNumber = req.userId;
    console.log(
      "🚀 ~ getQuestionsToPlay ~ studentRollNumber:",
      studentRollNumber
    );
    const limit = 20; // Number of questions per quiz
    const questions = await getUnansweredQuestions(studentRollNumber, limit);
    console.log("🚀 ~ getQuestionsToPlay ~ questions:", questions);
    handleResponse(
      res,
      200,
      "Fetched Unanswered Questions Successfully",
      questions
    );
  } catch (error) {
    next(error);
  }
};

// Get answered questions
export const getStudentAnswers = async (req, res, next) => {
  try {
    const studentRollNumber = req.userId;
    console.log(
      "🚀 ~ getStudentAnswers ~ studentRollNumber:",
      studentRollNumber
    );
    const answers = await getAnsweredQuestions(studentRollNumber);
    console.log("🚀 ~ getStudentAnswers ~ answers:", answers);
    handleResponse(
      res,
      200,
      "Fetched Attempted Questions Successfully",
      answers
    );
  } catch (error) {
    next(error);
  }
};
