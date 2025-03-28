import pool from "../config/dbConn.js";

export const getStudentPerformanceService = async (rollNumber) => {
  try {
    const result = await pool.query(
      `
        SELECT
            s.roll_number,
            s.name,
            COUNT(sa.question_id) AS total_questions_attempted,
            SUM(CASE WHEN sa.is_correct = true THEN 1 ELSE 0 END) AS correct_answers,
            ROUND(
                (SUM(CASE WHEN sa.is_correct = true THEN 1 ELSE 0 END) * 100.0 / COUNT(sa.question_id)),
                2
            ) AS accuracy,
            SUM(CASE WHEN cq.difficulty = 'easy' THEN 1 ELSE 0 END) AS easy_questions_attempted,
            SUM(CASE WHEN cq.difficulty = 'medium' THEN 1 ELSE 0 END) AS medium_questions_attempted,
            SUM(CASE WHEN cq.difficulty = 'hard' THEN 1 ELSE 0 END) AS hard_questions_attempted,
            SUM(CASE WHEN sa.is_correct = true AND cq.difficulty = 'easy' THEN 1 ELSE 0 END) AS easy_correct,
            SUM(CASE WHEN sa.is_correct = true AND cq.difficulty = 'medium' THEN 1 ELSE 0 END) AS medium_correct,
            SUM(CASE WHEN sa.is_correct = true AND cq.difficulty = 'hard' THEN 1 ELSE 0 END) AS hard_correct,
            ROUND(
                (
                    SUM(CASE WHEN sa.is_correct = true AND cq.difficulty = 'easy' THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(CASE WHEN cq.difficulty = 'easy' THEN 1 ELSE 0 END), 0)
                ),
                2
            ) AS easy_accuracy,
            ROUND(
                (
                    SUM(CASE WHEN sa.is_correct = true AND cq.difficulty = 'medium' THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(CASE WHEN cq.difficulty = 'medium' THEN 1 ELSE 0 END), 0)
                ),
                2
            ) AS medium_accuracy,
            ROUND(
                (
                    SUM(CASE WHEN sa.is_correct = true AND cq.difficulty = 'hard' THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(CASE WHEN cq.difficulty = 'hard' THEN 1 ELSE 0 END), 0)
                ),
                2
            ) AS hard_accuracy,
            SUM(CASE WHEN cq.operation = 'addition' THEN 1 ELSE 0 END) AS addition_questions,
            SUM(CASE WHEN cq.operation = 'subtraction' THEN 1 ELSE 0 END) AS subtraction_questions,
            SUM(CASE WHEN cq.operation = 'multiplication' THEN 1 ELSE 0 END) AS multiplication_questions,
            SUM(CASE WHEN cq.operation = 'division' THEN 1 ELSE 0 END) AS division_questions,
            SUM(CASE WHEN sa.is_correct = true AND cq.operation = 'addition' THEN 1 ELSE 0 END) AS addition_correct,
            SUM(CASE WHEN sa.is_correct = true AND cq.operation = 'subtraction' THEN 1 ELSE 0 END) AS subtraction_correct,
            SUM(CASE WHEN sa.is_correct = true AND cq.operation = 'multiplication' THEN 1 ELSE 0 END) AS multiplication_correct,
            SUM(CASE WHEN sa.is_correct = true AND cq.operation = 'division' THEN 1 ELSE 0 END) AS division_correct,
            ROUND(
                (
                    SUM(CASE WHEN sa.is_correct = true AND cq.operation = 'addition' THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(CASE WHEN cq.operation = 'addition' THEN 1 ELSE 0 END), 0)
                ),
                2
            ) AS addition_accuracy,
            ROUND(
                (
                    SUM(CASE WHEN sa.is_correct = true AND cq.operation = 'subtraction' THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(CASE WHEN cq.operation = 'subtraction' THEN 1 ELSE 0 END), 0)
                ),
                2
            ) AS subtraction_accuracy,
            ROUND(
                (
                    SUM(CASE WHEN sa.is_correct = true AND cq.operation = 'multiplication' THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(CASE WHEN cq.operation = 'multiplication' THEN 1 ELSE 0 END), 0)
                ),
                2
            ) AS multiplication_accuracy,
            ROUND(
                (
                    SUM(CASE WHEN sa.is_correct = true AND cq.operation = 'division' THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(CASE WHEN cq.operation = 'division' THEN 1 ELSE 0 END), 0)
                ),
                2
            ) AS division_accuracy
        FROM
            students s
        LEFT JOIN
            quiz_sessions qs ON s.roll_number = qs.student_roll_number
        LEFT JOIN
            student_answers sa ON qs.id = sa.quiz_session_id
        LEFT JOIN
            custom_questions cq ON sa.question_id = cq.id
        WHERE s.roll_number = $1
        GROUP BY
            s.roll_number, s.name;
      `,
      [rollNumber]
    );

    const studentData = result.rows[0];

    if (!studentData) {
      return null;
    }

    return {
      roll_number: studentData.roll_number,
      name: studentData.name,
      overallPerformance: {
        total_questions_attempted: parseInt(
          studentData.total_questions_attempted
        ),
        correct_answers: parseInt(studentData.correct_answers),
        accuracy: parseFloat(studentData.accuracy),
        easy_questions: parseInt(studentData.easy_questions_attempted),
        medium_questions: parseInt(studentData.medium_questions_attempted),
        hard_questions: parseInt(studentData.hard_questions_attempted),
      },
      difficultyPerformance: {
        easy: {
          attempted: parseInt(studentData.easy_questions_attempted),
          correct: parseInt(studentData.easy_correct),
          accuracy: parseFloat(studentData.easy_accuracy),
        },
        medium: {
          attempted: parseInt(studentData.medium_questions_attempted),
          correct: parseInt(studentData.medium_correct),
          accuracy: parseFloat(studentData.medium_accuracy),
        },
        hard: {
          attempted: parseInt(studentData.hard_questions_attempted),
          correct: parseInt(studentData.hard_correct),
          accuracy: parseFloat(studentData.hard_accuracy),
        },
      },
      operationPerformance: {
        addition: {
          attempted: parseInt(studentData.addition_questions),
          correct: parseInt(studentData.addition_correct),
          accuracy: parseFloat(studentData.addition_accuracy),
        },
        subtraction: {
          attempted: parseInt(studentData.subtraction_questions),
          correct: parseInt(studentData.subtraction_correct),
          accuracy: parseFloat(studentData.subtraction_accuracy),
        },
        multiplication: {
          attempted: parseInt(studentData.multiplication_questions),
          correct: parseInt(studentData.multiplication_correct),
          accuracy: parseFloat(studentData.multiplication_accuracy),
        },
        division: {
          attempted: parseInt(studentData.division_questions),
          correct: parseInt(studentData.division_correct),
          accuracy: parseFloat(studentData.division_accuracy),
        },
      },
    };
  } catch (error) {
    console.error("Error getting student performance:", error);
    throw error;
  }
};
