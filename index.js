import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/dbConn.js";

import teacherRoute from "./routes/teacher-routes/teacherRoute.js";
import customQuestionsRoute from "./routes/custom-questions/customQuestionsRoute.js";

import authRoute from "./routes/auth-routes/authRoute.js";
import errorHandling from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import createTeacherTable from "./data/createTeacherTable.js";
import createCustomQuestionsTable from "./data/createCustomQuestions.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3500;

//middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes (Unprotected)
app.use("/api", authRoute);

// // JWT Authentication (Protected Routes)
// app.use(verifyJWT);

// Protected Routes
app.use("/api/teacher", teacherRoute);
// app.use("/api/custom-questions", customQuestionsRoute);

//Error handling middleware
app.use(errorHandling);

//Creating table before stating server
createTeacherTable();
createCustomQuestionsTable();

//TESTING POSTGRES Connection
app.get("/", async (req, res) => {
  console.log("Start");
  const result = await pool.query("Select current_database()");
  console.log("end");
  console.log(result);
  res.send(`The database name is: ${result.rows[0].current_database}`);
});

//server running

app.listen(port, () => {
  console.log(`Server is running on http:localhost: ${port}`);
});
