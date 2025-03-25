// backend/src/middlewares/verifyJWT.js

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/dbConn.js";

dotenv.config();

const verifyJWT = async (req, res, next) => {
  console.log("verifyJWT");
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401); // Unauthorized

  const token = authHeader.split(" ")[1];
  console.log("🚀 ~ verifyJWT ~ token:", token);

  console.log(
    "process.env.ACCESS_TOKEN_SECRET:",
    process.env.ACCESS_TOKEN_SECRET
  );

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403); // 403 --> Invalid token

    console.log("🚀 ~ jwt.verify ~ decoded:", decoded);
    const email = decoded.UserInfo.email;
    const id = decoded.UserInfo.id;

    try {
      let queryText;
      if (email) {
        queryText = "SELECT id, email from teachers WHERE id = $1";
      } else {
        queryText = "SELECT * from students WHERE roll_number = $1";
      }

      const result = await pool.query(queryText, [id]);
      const freshUser = result.rows[0];
      console.log("🚀 ~ jwt.verify ~ freshUser:", freshUser);

      if (!freshUser) return res.sendStatus(404); // Not found if no user is found

      req.email = email;
      req.userId = freshUser.id || freshUser.roll_number; // Use 'id' from PostgreSQL result
      console.log("END of JWTVerify");
      next();
    } catch (error) {
      console.error(error);
      return res.sendStatus(500); // Internal server error
    }
  });
};
console.log(
  "🚀 ~ verifyJWT ~ process.env.ACCESS_TOKEN_SECRET:",
  process.env.ACCESS_TOKEN_SECRET
);

export default verifyJWT;
