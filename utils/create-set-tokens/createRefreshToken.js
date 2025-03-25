import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createRefreshToken = ({ user }) => {
  try {
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          email: user.email || null,
          id: user.id || user.roll_number,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME }
    );
    return refreshToken;
  } catch (err) {
    console.error(`Error creating refresh token: ${err.message}`);
    return null;
  }
};
