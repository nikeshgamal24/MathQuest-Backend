import pool from "../config/dbConn.js";

// Add a custom question
export const addCustomQuestion = async (questionData) => {
    try {
        const { teacher_id, operation, difficulty, question, correct_answer, wrong_option1, wrong_option2, wrong_option3 } = questionData;
        const result = await pool.query(
            `INSERT INTO custom_questions (teacher_id, operation, difficulty, question, correct_answer, wrong_option1, wrong_option2, wrong_option3)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [teacher_id, operation, difficulty, question, correct_answer, wrong_option1, wrong_option2, wrong_option3]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error adding custom question:", error);
        throw error;
    }
};