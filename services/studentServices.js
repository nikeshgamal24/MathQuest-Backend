import pool from "../config/dbConn.js";
import { createAccessToken } from "../utils/create-set-tokens/createAccessToken.js";
import { createRefreshToken } from "../utils/create-set-tokens/createRefreshToken.js";

export const registerStudentService = async (studentData) => {
  try {
    const { name, roll_number, className } = studentData; // Rename 'class' to 'className' to avoid keyword conflicts
    const result = await pool.query(
      `INSERT INTO students (name, roll_number, class) VALUES ($1, $2, $3) RETURNING *`,
      [name, roll_number, className]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error registering student:", error);
    throw error;
  }
};

export const loginStudentService = async (rollNumber) => {
  try {
    const result = await pool.query(
      `SELECT * FROM students WHERE roll_number = $1`,
      [rollNumber]
    );
    const student = result.rows[0];
    console.log("🚀 ~ loginStudentService ~ student:", student)
    // Generate tokens
    const accessToken = createAccessToken({ user: student });
    const refreshToken = createRefreshToken({ user: student });
    console.log("🚀 ~ loginStudentService ~ accessToken:", accessToken)
    console.log("🚀 ~ loginStudentService ~ refreshToken:", refreshToken)

    // Save refresh token to database
    await pool.query("UPDATE students SET refresh_token = $1 WHERE roll_number = $2", [
      refreshToken,
      student.roll_number,
    ]);

    return { accessToken, refreshToken, student };
    // Returns the student object or undefined if not found
  } catch (error) {
    console.error("Error logging in student:", error);
    throw error;
  }
};