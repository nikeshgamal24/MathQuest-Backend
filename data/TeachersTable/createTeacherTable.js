import pool from "../../config/dbConn.js";

const createTeacherTable = async () => {
  const queryText = `
   CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY, 
    full_name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, 
    refresh_token VARCHAR(255) UNIQUE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
    `;
  try {
    await pool.query(queryText);
    // console.log("Teacher Table created or already exists");
  } catch (err) {
    console.log("Error creating teachers table: ", err);
  }
};

export default createTeacherTable;
