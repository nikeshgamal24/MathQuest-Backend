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
  quizSessionId,
  studentRollNumber,
  answers // Now an array of answer objects
) => {
  try {
    await pool.query("BEGIN"); // Start transaction

    for (const answer of answers) {
      const { questionId, studentAnswer, isCorrect } = answer;

      if (
        questionId === undefined ||
        studentAnswer === undefined ||
        isCorrect === undefined
      ) {
        throw new Error("Invalid answer object in the array.");
      }

      await pool.query(
        `INSERT INTO student_answers (quiz_session_id, question_id, student_answer, is_correct, student_roll_number) VALUES ($1, $2, $3, $4, $5)`,
        [quizSessionId, questionId, studentAnswer, isCorrect, studentRollNumber]
      );
    }

    await pool.query("COMMIT"); // Commit transaction
    return true;
  } catch (error) {
    await pool.query("ROLLBACK"); // Rollback transaction on error
    console.error("Error recording student answers:", error);
    return false;
  }
};

// End quiz session and calculate score
export const endQuizSession = async (quizSessionId) => {
  if (!quizSessionId) {
    throw new Error("quizSessionId is required.");
  }

  try {
    const result = await pool.query(
      `SELECT
        SUM(CASE
          WHEN cq.difficulty = 'easy' THEN 1
          WHEN cq.difficulty = 'medium' THEN 2
          WHEN cq.difficulty = 'hard' THEN 3
          ELSE 0
        END) AS score
      FROM student_answers sa
      JOIN custom_questions cq ON sa.question_id = cq.id
      WHERE sa.quiz_session_id = $1 AND sa.is_correct = true`,
      [quizSessionId]
    );

    const score = parseInt(result.rows[0]?.score || 0);

    if (result.rows.length === 0) {
      // No correct answers found, you may want to return 0 or a different error message
      // Or you can leave as is, and the score will be 0.
      console.log(
        `No correct answers found for quizSessionId: ${quizSessionId}. Score set to 0.`
      );
    }

    await pool.query(
      `UPDATE quiz_sessions SET end_time = NOW(), score = $1 WHERE id = $2`,
      [score, quizSessionId]
    );

    return score;
  } catch (error) {
    console.error(
      `Error ending quiz session (quizSessionId: ${quizSessionId}):`,
      error
    );
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
                 JOIN quiz_sessions qs ON sa.quiz_session_id = qs.id
                 WHERE qs.student_roll_number = $1
             ) ORDER BY RANDOM() LIMIT $2`,
      [studentRollNumber, limit]
    );
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
             JOIN quiz_sessions qs ON sa.quiz_session_id = qs.id
             WHERE qs.student_roll_number = $1`,
      [studentRollNumber]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting answered questions:", error);
    throw error;
  }
};
