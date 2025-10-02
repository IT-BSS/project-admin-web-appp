import { Router } from "express";
import { registerHandler, loginHandler, refreshHandler, logoutHandler, profileHandler, } from "../../controller/auth/authController.js";
import { authenticate } from "../../middleware/auth/authMiddleware.js";
const router = Router();
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", authenticate, logoutHandler);
router.get("/me", authenticate, profileHandler);
export default router;
//# sourceMappingURL=authRoutes.js.map