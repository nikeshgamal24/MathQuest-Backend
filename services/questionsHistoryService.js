import pool from "../config/dbConn.js";

export const questionHistoryService = async (studentRollNumber) => {
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
          wrong_option1
      FROM
          custom_questions;
    `);
    return result.rows;
  } catch (error) {
    console.error("Error getting all questions:", error);
    throw error;
  }
};
