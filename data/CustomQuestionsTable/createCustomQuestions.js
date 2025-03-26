import pool from "../../config/dbConn.js";


const createCustomQuestionsTable = async () => {
  const queryText = `
  CREATE TABLE IF NOT EXISTS custom_questions (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id),
    operation VARCHAR(255) NOT NULL,
    difficulty VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    wrong_option1 VARCHAR(255) NOT NULL,
    wrong_option2 VARCHAR(255),
    wrong_option3 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `;
  try {
    await pool.query(queryText);
    // console.log("Teacher Table created or already exists");
  } catch (err) {
    console.log("Error creating teachers table: ", err);
  }
};

export default createCustomQuestionsTable;
