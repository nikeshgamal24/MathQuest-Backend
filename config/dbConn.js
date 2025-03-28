import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

pool.on("connect", () => {
  console.log("Connection pool established with Database");
});

pool.on("error", (err) => {
  console.error("PostgreSQL Pool Error:", err);
});

export default pool;