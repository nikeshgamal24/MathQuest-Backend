import pool from "../../config/dbConn.js";


const createStudentTable = async () => {
  const queryText = `
   CREATE TABLE IF NOT EXISTS students (
    roll_number VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `;
  try {
    pool.query(queryText);
  } catch (err) {
    console.log("Error creating teachers table: ", err);
  }
};

export default createStudentTable;
