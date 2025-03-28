import pool from "../config/dbConn.js";
import bcrypt from "bcrypt";
import { createRefreshToken } from "../utils/create-set-tokens/createRefreshToken.js";
import { createAccessToken } from "../utils/create-set-tokens/createAccessToken.js";

export const getAllTeachersService = async () => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, username, created_at FROM teachers"
    );
    return result.rows;
  } catch (error) {
    console.error("Error in getAllTeachersService:", error);
    throw error;
  }
};

export const getTeacherByIdService = async ({ id }) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, username, created_at FROM teachers WHERE id = $1",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in getTeacherByIdService:", error);
    throw error;
  }
};

export const registerTeacherService = async ({
  fullName,
  email,
  username,
  password,
}) => {
  try {
    if (!fullName || !email || !username || !password) {
      throw new Error("Missing required fields");
    }
    console.log("🚀 ~ registerTeacherService ~ password:", password);
    console.log("🚀 ~ registerTeacherService ~ username:", username);
    console.log("🚀 ~ registerTeacherService ~ email:", email);
    console.log("🚀 ~ registerTeacherService ~ fullName:", fullName);

    const result = await pool.query(
      "INSERT INTO teachers (full_name, email, username, password) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, username, created_at",
      [fullName, email, username, password]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Username or email already exists");
    }
    console.error("Error in registerTeacherService:", error);
    throw error;
  }
};

export const loginTeacherService = async ({ username, password }) => {
  try {
    const result = await pool.query(
      "SELECT * FROM teachers WHERE username = $1",
      [username]
    );
    const teacher = result.rows[0];

    console.log("🚀 ~ loginTeacherService ~ teacher:", teacher);
    if (!teacher) {
      throw new Error("Invalid username or password");
    }

    const passwordMatch = await bcrypt.compare(password, teacher.password);
    console.log("🚀 ~ loginTeacherService ~ passwordMatch:", passwordMatch);

    if (!passwordMatch) {
      throw new Error("Invalid username or password");
    }

    // Generate tokens
    const accessToken = createAccessToken({ user: teacher });
    const refreshToken = createRefreshToken({ user: teacher });

    // Save refresh token to database
    await pool.query("UPDATE teachers SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      teacher.id,
    ]);

    console.log("🚀 ~ loginTeacherService ~ refreshToken:", refreshToken);
    console.log("🚀 ~ loginTeacherService ~ accessToken:", accessToken);

    return { accessToken, refreshToken, teacher };
  } catch (error) {
    console.error("Error in loginTeacherService:", error);
    throw error;
  }
};

export const logoutTeacherService = async (refreshToken) => {
  try {
    // Attempt to remove the refresh token from the teachers table
    const teachersResult = await pool.query(
      "UPDATE teachers SET refresh_token = NULL WHERE refresh_token = $1",
      [refreshToken]
    );
    console.log("🚀 ~ logoutTeacherService ~ teachersResult:", teachersResult);

    return true; // Indicate successful logout
  } catch (error) {
    console.error("Error in logoutTeacherService:", error);
    return false; // Indicate logout failure
  }
};

export const updateTeacherService = async ({
  id,
  fullName,
  email,
  username,
  password,
}) => {
  try {
    if (!id || !fullName || !email || !username || !password) {
      throw new Error("Missing required fields");
    }

    const result = await pool.query(
      "UPDATE teachers SET full_name = $1, email = $2, username = $3, password = $4 WHERE id = $5 RETURNING id, full_name, email, username, created_at",
      [fullName, email, username, hashedPassword, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in updateTeacherService:", error);
    throw error;
  }
};

export const deleteTeacherService = async ({ id }) => {
  try {
    const result = await pool.query(
      "DELETE FROM teachers WHERE id = $1 RETURNING id, full_name, email, username, created_at",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in deleteTeacherService:", error);
    throw error;
  }
};

export const getStudentListService = async () => {
  try {
    const result = await pool.query(`
      SELECT roll_number, name, class,created_at
      FROM students
      ORDER BY created_at DESC;
    `);
    return result.rows;
  } catch (error) {
    console.error("Error getting student list:", error);
    throw error;
  }
};

export const deleteStudentService = async (rollNumber) => {
  try {
    // 1. Delete associated records from student_answers
    await pool.query("DELETE FROM student_answers WHERE quiz_session_id IN (SELECT id FROM quiz_sessions WHERE student_roll_number = $1)", [rollNumber]);

    // 2. Delete associated records from quiz_sessions
    await pool.query("DELETE FROM quiz_sessions WHERE student_roll_number = $1", [rollNumber]);

    // 3. Delete the student
    const result = await pool.query(
      "DELETE FROM students WHERE roll_number = $1 RETURNING *",
      [rollNumber]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

export const getStudentDetailsService = async (rollNumber) => {
  try {
    const queryText = `
      SELECT
          s.roll_number,
          s.name,
          COUNT(sa.question_id) AS total_questions_attempted,
          SUM(CASE WHEN cq.difficulty = 'Easy' THEN 1 ELSE 0 END) AS easy_questions_attempted,
          SUM(CASE WHEN cq.difficulty = 'Medium' THEN 1 ELSE 0 END) AS medium_questions_attempted,
          SUM(CASE WHEN cq.difficulty = 'Hard' THEN 1 ELSE 0 END) AS hard_questions_attempted,
          SUM(CASE WHEN sa.is_correct = true THEN 1 ELSE 0 END) AS correct_answers,
          SUM(CASE WHEN sa.is_correct = true AND cq.difficulty = 'Easy' THEN 1 ELSE 0 END) AS easy_correct,
          SUM(CASE WHEN sa.is_correct = true AND cq.difficulty = 'Medium' THEN 1 ELSE 0 END) AS medium_correct,
          SUM(CASE WHEN sa.is_correct = true AND cq.difficulty = 'Hard' THEN 1 ELSE 0 END) AS hard_correct,
          (SELECT SUM(score) FROM quiz_sessions WHERE student_roll_number = s.roll_number) AS total_score, 
          ROUND((SUM(CASE WHEN sa.is_correct = true THEN 1 ELSE 0 END) * 100.0 / COUNT(sa.question_id)), 2) AS accuracy,
          ROUND(AVG(EXTRACT(EPOCH FROM (qs.end_time - qs.start_time))), 2) AS average_time_seconds,
          JSON_AGG(
              JSON_BUILD_OBJECT(
                  'question_id', cq.id,
                  'question', cq.question,
                  'operation', cq.operation,
                  'difficulty', cq.difficulty,
                  'correct_answer', cq.correct_answer,
                  'student_answer', sa.student_answer,
                  'is_correct', sa.is_correct
              )
          ) AS attempted_questions
      FROM
          students s
      LEFT JOIN
          quiz_sessions qs ON s.roll_number = qs.student_roll_number
      LEFT JOIN
          student_answers sa ON qs.id = sa.quiz_session_id
      LEFT JOIN
          custom_questions cq ON sa.question_id = cq.id
      WHERE
          s.roll_number = $1
      GROUP BY
          s.roll_number, s.name;
      `;
    const result = await pool.query(queryText, [rollNumber]);
    console.log("Raw Query Result:", result.rows[0]); // Add this line for debugging
    return result.rows[0];
  } catch (error) {
    console.error("Error getting student details:", error);
    throw error;
  }
};

