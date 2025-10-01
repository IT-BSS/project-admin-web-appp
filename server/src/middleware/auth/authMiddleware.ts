import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/jwt.js";

export const authenticate = (req: Request, res: Response, next: NextFunction): Response | void => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ error: "No access token" });

    const payload = verifyAccessToken(token) as any;
    (req as any).user = { guid: payload.guid, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
