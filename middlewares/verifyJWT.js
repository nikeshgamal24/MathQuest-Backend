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
      const queryText = "SELECT id, email from teachers WHERE email = $1";

      const result = await pool.query(queryText, [email]);
      const freshUser = result.rows[0];

      if (!freshUser) return res.sendStatus(404); // Not found if no user is found
      console.log("🚀 ~ jwt.verify ~ freshUser:", freshUser)

      req.email = email;
      req.userId = freshUser.id; // Use 'id' from PostgreSQL result

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
