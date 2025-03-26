import pool from "../../config/dbConn.js";

const createQuizSessions = async () => {
  const queryText = `
 CREATE TABLE IF NOT EXISTS quiz_sessions (
    id SERIAL PRIMARY KEY,
    student_roll_number VARCHAR(255) REFERENCES students(roll_number),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    score INTEGER
);

    `;
  try {
    await pool.query(queryText);
    // console.log("Teacher Table created or already exists");
  } catch (err) {
    console.log("Error creating teachers table: ", err);
  }
};

export default createQuizSessions;
