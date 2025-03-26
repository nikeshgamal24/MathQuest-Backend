import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/dbConn.js";

import teacherRoute from "./routes/teacher-routes/teacherRoute.js";
import studentRoute from "./routes/student-routes/studentRoute.js";
import authRoute from "./routes/auth-routes/authRoute.js";
import errorHandling from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import { setSystemDatabaseTables } from "./data/setSystemDatabaseTables.js";
import credentials from "./middlewares/credentials.js";
import corsOptions from "./config/corsOptions.js";
import leaderboardRoute from "./routes/leaderboard-routes/leaderboardRoute.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3500;

//middlewares
//middleware for access-control-allow credentials
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

//open endpoint
app.get("/", async (req, res) => {
  res.send(`Server is running`);
});

// Routes (Unprotected)
app.use("/api", authRoute);
app.use("/api/leaderboard", leaderboardRoute);

// // JWT Authentication (Protected Routes)
// app.use(verifyJWT);

// Protected Routes
app.use("/api/teacher", teacherRoute);
app.use("/api/student", studentRoute);

// app.use("/api/custom-questions", customQuestionsRoute);

//Error handling middleware
app.use(errorHandling);

//Creating table before stating server
setSystemDatabaseTables()

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
