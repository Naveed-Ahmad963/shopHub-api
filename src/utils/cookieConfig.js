// src/utils/cookieConfig.js
// ============================================
export const getCookieConfig = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24 * (process.env.COOKIE_EXPIRES_IN || 7),
  sameSite: "lax",
});

export const setAuthCookie = (res, token) => {
  res.cookie("token", token, getCookieConfig());
};
