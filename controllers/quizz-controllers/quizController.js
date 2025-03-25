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
    const { studentRollNumber } = req.body;
    const sessionId = await startQuizSession(studentRollNumber);
    res.status(201).json({ sessionId });
  } catch (error) {
    next(error);
  }
};

// Record student answer
export const answerQuestion = async (req, res, next) => {
  try {
    const { sessionId, questionId, studentAnswer, isCorrect } = req.body;
    await recordStudentAnswer(sessionId, questionId, studentAnswer, isCorrect);
    res.sendStatus(204);
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
