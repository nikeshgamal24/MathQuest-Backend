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
