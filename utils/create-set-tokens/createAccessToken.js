import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createAccessToken = ({ user }) => {
  console.log("🚀 ~ createAccessToken ~ user-email:", user)
  try {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: user.email,
          id: user.id,
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
