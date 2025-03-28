import pool from "../config/dbConn.js";

// Add a custom question
export const addCustomQuestionService = async (questionData) => {
  try {
    const {
      teacher_id,
      operation,
      difficulty,
      question,
      correct_answer,
      wrong_option1,
      wrong_option2,
      wrong_option3,
    } = questionData;
    const result = await pool.query(
      `INSERT INTO custom_questions (teacher_id, operation, difficulty, question, correct_answer, wrong_option1, wrong_option2, wrong_option3)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        teacher_id,
        operation,
        difficulty,
        question,
        correct_answer,
        wrong_option1,
        wrong_option2,
        wrong_option3,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding custom question:", error);
    throw error;
  }
};

export const getQuestionsListService = async () => {
  try {
    const result = await pool.query(`
          SELECT
              id,
              question,
              operation,
              difficulty,
              correct_answer,
              wrong_option1,
              wrong_option2,
              wrong_option3,
              created_at
          FROM
              custom_questions
          ORDER BY
              created_at DESC;
        `);
    return result.rows;
  } catch (error) {
    console.error("Error getting all questions:", error);
    throw error;
  }
};

export const updateQuestionService = async (
  id,
  question,
  operation,
  difficulty,
  correctAnswer,
  wrongOption1,
  wrongOption2,
  wrongOption3
) => {
  try {
    const result = await pool.query(
      `
      UPDATE custom_questions
      SET question = $1, operation = $2, difficulty = $3, correct_answer = $4, wrong_option1 = $5, wrong_option2 = $6, wrong_option3 = $7
      WHERE id = $8
      RETURNING *;
      `,
      [
        question,
        operation,
        difficulty,
        correctAnswer,
        wrongOption1,
        wrongOption2,
        wrongOption3,
        id,
      ]
    );
    return result.rows[0]; // Return the updated question details
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

export const deleteQuestionService = async (id) => {
  try {
    await pool.query("BEGIN"); // Start a transaction

    // 1. Delete related student answers first
    await pool.query("DELETE FROM student_answers WHERE question_id = $1", [id]);

    // 2. Then delete the question
    const result = await pool.query(
      `
      DELETE FROM custom_questions
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    await pool.query("COMMIT"); // Commit the transaction
    return result.rows[0];
  } catch (error) {
    await pool.query("ROLLBACK"); // Roll back the transaction if an error occurs
    console.error("Error deleting question:", error);
    throw error;
  }
};
