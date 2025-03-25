import handleResponse from "../../middlewares/handleResponse.js";
import {
  loginTeacherService,
  logoutTeacherService,
  registerTeacherService,
} from "../../models/teacherModel.js";
import bcrypt from "bcrypt";
import { setCookie } from "../../utils/create-set-tokens/setCookie.js";
import pool from "../../config/dbConn.js";

export const registerTeacher = async (req, res, next) => {
  try {
    const { fullName, email, username, password } = req.body;
    console.log(
      "🚀 ~ registerTeacher ~ fullName, email, username, password:",
      fullName,
      email,
      username,
      password
    );

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🚀 ~ registerTeacher ~ hashedPassword:", hashedPassword);

    // Call the service to create the teacher record
    const newTeacher = await registerTeacherService({
      fullName,
      email,
      username,
      password: hashedPassword,
    });
    console.log("🚀 ~ registerTeacher ~ newTeacher:", newTeacher);

    handleResponse(
      res,
      201,
      "New Teacher Account Created Successfully",
      newTeacher
    );
  } catch (err) {
    next(err);
  }
};

export const loginTeacher = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Input Validation (Optional, but recommended)
    if (!username || !password) {
      return handleResponse(res, 400, "Missing username or password");
    }

    const { accessToken, refreshToken, teacher } = await loginTeacherService({
      username,
      password,
    });

    if (!accessToken || !refreshToken || !teacher) {
      return handleResponse(res, 401, "Invalid username or password");
    }

    // Set the refresh token cookie
    setCookie(res, refreshToken);

    // Send the access token and user data as the response
    res.status(200).json({ accessToken, user: teacher });
  } catch (err) {
    console.error("Error in loginTeacher:", err); // Log the error
    if (err.message === "Invalid username or password") {
      return handleResponse(res, 401, err.message);
    }
    next(err);
  }
};

export const handleLogout = async (req, res, next) => {
  try {
    console.log("LOGOUT HANDLER");
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204); //No Content

    const refreshToken = cookies.jwt;
    console.log("🚀 ~ handleLogout ~ refreshToken:", refreshToken);

    if (!refreshToken) {
      console.log("Refresh token missing in cookie.");
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Call the service to remove the refresh token from the database
    const logoutResult = await logoutTeacherService(refreshToken);

    if (!logoutResult) {
      console.log("Refresh token not found in database.");
      return res.status(404).json({ message: "Refresh token not found" });
    }

    // Clear the JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true, // Adjust if not using HTTPS
    });

    console.log("Logout successful.");
    res.sendStatus(204); // No Content
  } catch (err) {
    console.error("Error in logoutTeacher:", err);
    next(err);
  }
};
