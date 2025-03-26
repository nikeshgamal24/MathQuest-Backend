import pool from "../config/dbConn.js";

// Start a quiz session
export const startQuizSession = async (studentRollNumber) => {
  try {
    const result = await pool.query(
      `INSERT INTO quiz_sessions (student_roll_number) VALUES ($1) RETURNING id`,
      [studentRollNumber]
    );
    console.log("🚀 ~ startQuizSession ~ result:", result);
    return result.rows[0].id;
  } catch (error) {
    console.error("Error starting quiz session:", error);
    throw error;
  }
};

// Record student answer
export const recordStudentAnswer = async (
  sessionId,
  questionId,
  studentAnswer,
  isCorrect
) => {
  try {
    await pool.query(
      `INSERT INTO student_answers (session_id, question_id, student_answer, is_correct) VALUES ($1, $2, $3, $4)`,
      [sessionId, questionId, studentAnswer, isCorrect]
    );
    return true;
  } catch (error) {
    console.error("Error recording student answer:", error);
    throw error;
  }
};

// End quiz session and calculate score
export const endQuizSession = async (sessionId) => {
  try {
    const result = await pool.query(
      `UPDATE quiz_sessions SET end_time = NOW(), score = (
                SELECT COUNT(*) FROM student_answers WHERE session_id = $1 AND is_correct = TRUE
            ) WHERE id = $1 RETURNING score`,
      [sessionId]
    );
    return result.rows[0].score;
  } catch (error) {
    console.error("Error ending quiz session:", error);
    throw error;
  }
};

// Get unanswered questions for a student
export const getUnansweredQuestions = async (studentRollNumber, limit) => {
  try {
    const result = await pool.query(
      `SELECT cq.* FROM custom_questions cq
             WHERE cq.id NOT IN (
                 SELECT sa.question_id FROM student_answers sa
                 JOIN quiz_sessions qs ON sa.session_id = qs.id
                 WHERE qs.student_roll_number = $1
             ) ORDER BY RANDOM() LIMIT $2`,
      [studentRollNumber, limit]
    );
    console.log("🚀 ~ getUnansweredQuestions ~ result:", result);
    return result.rows;
  } catch (error) {
    console.error("Error getting unanswered questions:", error);
    throw error;
  }
};

// Get answered questions for a student
export const getAnsweredQuestions = async (studentRollNumber) => {
  try {
    const result = await pool.query(
      `SELECT cq.*, sa.student_answer, sa.is_correct FROM custom_questions cq
             JOIN student_answers sa ON cq.id = sa.question_id
             JOIN quiz_sessions qs ON sa.session_id = qs.id
             WHERE qs.student_roll_number = $1`,
      [studentRollNumber]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting answered questions:", error);
    throw error;
  }
};
