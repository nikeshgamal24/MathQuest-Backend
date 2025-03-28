import pool from "../config/dbConn.js";

const leaderboardService = {
  async getTopStudents() {
    try {
      const result = await pool.query(`
        SELECT
            s.roll_number,
            s.name,
            qs.score,
            COUNT(sa.question_id) AS total_questions_attempted,
            SUM(CASE WHEN sa.is_correct = true THEN 1 ELSE 0 END) AS correct_questions,
            SUM(CASE WHEN sa.is_correct = true AND cq.difficulty = 'easy' THEN 1 ELSE 0 END) AS easy_correct,
            SUM(CASE WHEN sa.is_correct = true AND cq.difficulty = 'medium' THEN 1 ELSE 0 END) AS medium_correct,
            SUM(CASE WHEN sa.is_correct = true AND cq.difficulty = 'hard' THEN 1 ELSE 0 END) AS hard_correct,
            ROUND((SUM(CASE WHEN sa.is_correct = true THEN 1 ELSE 0 END) * 100.0 / COUNT(sa.question_id)), 2) AS accuracy
        FROM
            students s
        JOIN
            quiz_sessions qs ON s.roll_number = qs.student_roll_number
        JOIN
            student_answers sa ON qs.id = sa.quiz_session_id
        JOIN
            custom_questions cq ON sa.question_id = cq.id
        GROUP BY
            s.roll_number, s.name, qs.score
        ORDER BY
            qs.score DESC
        LIMIT 10;
      `);
      return result.rows;
    } catch (error) {
      console.error("Error getting top students:", error);
      throw error;
    }
  },
};

export default leaderboardService;
