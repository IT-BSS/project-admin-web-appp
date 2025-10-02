import jwt, { Secret, SignOptions } from "jsonwebtoken";

const ACCESS_SECRET: Secret = process.env.JWT_SECRET || "default_access_secret";
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

const ACCESS_EXP: string | number = process.env.JWT_ACCESS_EXPIRY || "1d";
const REFRESH_EXP: string | number = process.env.JWT_REFRESH_EXPIRY || "7d";

export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP } as SignOptions);
};

export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP } as SignOptions);
};

import { JwtPayload } from "jsonwebtoken";

export const verifyAccessToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, REFRESH_SECRET);
};
