import * as authService from "../../services/auth/authService.js";
export const registerHandler = async (req, res) => {
    try {
        const dto = req.body;
        const user = await authService.register(dto);
        return res.status(201).json({ user });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
export const loginHandler = async (req, res) => {
    try {
        const dto = req.body;
        const result = await authService.login(dto);
        return res.json(result);
    }
    catch (err) {
        return res.status(401).json({ error: err.message });
    }
};
export const refreshHandler = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(400).json({ error: "refreshToken required" });
        const tokens = await authService.refreshTokens(refreshToken);
        return res.json(tokens);
    }
    catch (err) {
        return res.status(401).json({ error: err.message });
    }
};
export const logoutHandler = async (req, res) => {
    try {
        const userGuid = req.user?.guid;
        if (!userGuid)
            return res.status(401).json({ error: "Not authenticated" });
        await authService.logout(userGuid);
        return res.json({ ok: true });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
export const profileHandler = async (req, res) => {
    try {
        const userGuid = req.user?.guid;
        if (!userGuid)
            return res.status(401).json({ error: "Not authenticated" });
        const profile = await authService.getProfile(userGuid);
        return res.json({ profile });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
//# sourceMappingURL=authController.js.map