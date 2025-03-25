import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createAccessToken = ({ user }) => {
  console.log("🚀 ~ createAccessToken ~ user-email:", user)
  try {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: user.email || null,
          id: user.id || user.roll_number,  // id for teacher and roll_number for student
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME }
    );
    return accessToken;
  } catch (err) {
    console.error(`Error creating refresh token: ${err.message}`);
    return null;
  }
};
