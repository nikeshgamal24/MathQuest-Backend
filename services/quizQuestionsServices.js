import pool from "../config/dbConn.js";

// Get unanswered questions for a student
export const getUnansweredQuestionService = async (studentId, limit) => {
    try {
        const result = await pool.query(
            `SELECT cq.* FROM custom_questions cq
             WHERE cq.id NOT IN (
                 SELECT qa.question_id FROM question_attempts qa
                 JOIN quiz_sessions qs ON qa.session_id = qs.id
                 WHERE qs.student_id = $1
             ) ORDER BY RANDOM() LIMIT $2`,
            [studentId, limit]
        );
        return result.rows;
    } catch (error) {
        console.error("Error getting unanswered questions:", error);
        throw error;
    }
};