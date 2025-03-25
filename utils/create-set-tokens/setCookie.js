export const setCookie = (res, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production'; //check if in production

  res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: isProduction ? "None" : "Lax", // "None" in production, "Lax" in development
      secure: isProduction, // true in production, false in development
      maxAge: 24 * 60 * 60 * 1000,
  });
};