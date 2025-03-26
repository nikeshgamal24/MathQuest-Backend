import pool from "../../config/dbConn.js";

const createQuizSessions = async () => {
  const queryText = `
CREATE TABLE IF NOT EXISTS student_answers (
    id SERIAL PRIMARY KEY,
    quiz_session_id INTEGER REFERENCES quiz_sessions(id),
    question_id INTEGER REFERENCES custom_questions(id),
    student_answer VARCHAR(255),
    is_correct BOOLEAN,
    student_roll_number VARCHAR(255) REFERENCES students(roll_number),
    UNIQUE (quiz_session_id, question_id, student_roll_number)
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
