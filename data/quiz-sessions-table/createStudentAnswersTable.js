import pool from "../../config/dbConn.js";

const createStudentAnswers = async () => {
  const queryText = `
  CREATE TABLE IF NOT EXISTS student_answers (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES quiz_sessions(id),
    question_id INTEGER REFERENCES custom_questions(id),
    student_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    `;
  try {
    pool.query(queryText);
    // console.log("Teacher Table created or already exists");
  } catch (err) {
    console.log("Error creating teachers table: ", err);
  }
};

export default createStudentAnswers;
