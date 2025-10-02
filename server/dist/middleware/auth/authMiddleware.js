import { verifyAccessToken } from "../../utils/jwt.js";
export const authenticate = (req, res, next) => {
    try {
        const auth = req.headers["authorization"];
        if (!auth)
            return res.status(401).json({ error: "No Authorization header" });
        const parts = String(auth).split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ error: "Invalid Authorization format" });
        }
        const token = parts[1];
        const payload = verifyAccessToken(token);
        req.user = { guid: payload.guid, email: payload.email };
        return next();
    }
    catch {
        return res.status(401).json({ error: "Unauthorized" });
    }
};
//# sourceMappingURL=authMiddleware.js.map