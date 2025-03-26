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
    const { sessionId, questionId, studentAnswer, isCorrect } = req.body;
    if (!sessionId || !questionId || !studentAnswer || !isCorrect) {
      handleResponse(res, 400, "Required Fields are missing");
    }
    const result = await recordStudentAnswer(
      sessionId,
      questionId,
      studentAnswer,
      isCorrect
    );
    console.log("🚀 ~ answerQuestion ~ result:", result);
    handleResponse(res, 200, "Answer Successfully Submitted");
  } catch (error) {
    next(error);
  }
};

// End quiz session
export const endQuiz = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
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
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

// Get answered questions
export const getStudentAnswers = async (req, res, next) => {
  try {
    const { studentRollNumber } = req.query;
    const answers = await getAnsweredQuestions(studentRollNumber);
    res.status(200).json(answers);
  } catch (error) {
    next(error);
  }
};
