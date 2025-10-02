import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.JWT_SECRET || "default_access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_refresh_secret";
const ACCESS_EXP = process.env.JWT_ACCESS_EXPIRY || "1d";
const REFRESH_EXP = process.env.JWT_REFRESH_EXPIRY || "7d";
export const signAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
};
export const signRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};
//# sourceMappingURL=jwt.js.map