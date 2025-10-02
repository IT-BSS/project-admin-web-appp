import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./middleware/logger.js";
import helloRouter from "./router/helloRouter.js";
import authRoutes from "./router/auth/authRoutes.js";
import { connectDB, query } from "./database/index.js";
import usersRouter from "./router/users/usersRouter.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: ["http://localhost:8080", "http://127.0.0.1:8080", "http://0.0.0.0:8080"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        timestamp: new Date().toISOString(),
    });
    next();
});
app.use("/api/hello", helloRouter);
app.get("/api/users", async (req, res, next) => {
    try {
        const result = await query("SELECT * FROM users");
        res.json(result.rows);
    }
    catch (err) {
        next(err);
    }
});
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
    });
});
app.use("*", (req, res) => {
    logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl,
    });
});
app.use((error, req, res, next) => {
    logger.error("Unhandled error", {
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
    });
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});
app.use("/api/users", usersRouter);
app.use("/api/auth", authRoutes);
async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        logger.info(`TEST TEST TEST TEST `);
        logger.info(`Server is running on port ${PORT}`);
        logger.info(`Health check: http://localhost:${PORT}/health`);
        logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
}
startServer().catch((err) => {
    console.error("Ошибка при запуске приложения:", err);
    process.exit(1);
});
export default app;
//# sourceMappingURL=app.js.map