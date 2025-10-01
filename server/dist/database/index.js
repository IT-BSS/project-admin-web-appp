import { Pool } from "pg";
const pool = new Pool({
    host: "postgres",
    port: 5432,
    database: "bss_database",
    user: "bss_user",
    password: "bss_password",
});
export const connectDB = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("✅ Успешное подключение к Postgres (через pg)");
    }
    catch (error) {
        console.error("❌ Ошибка подключения к Postgres:", error);
        throw error;
    }
};
export const query = (text, params) => {
    return pool.query(text, params);
};
//# sourceMappingURL=index.js.map