// here we connect the database
// use sequelize, for more information, see the sequelize documentation
// if you not use sequelize, you can PIDORAS blyat, i need you understand
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
    } catch (error) {
        console.error("❌ Ошибка подключения к Postgres:", error);
    }
};

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};
