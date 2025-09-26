// here we connect the database
// use sequelize, for more information, see the sequelize documentation
// if you not use sequelize, you can PIDORAS blyat, i need you understand
import { Pool } from "pg";

const pool = new Pool({
    host: "postgres",        // имя хоста (в Docker-сети или localhost, в зависимости от среды)
    port: 5432,
    database: "bss_database",
    user: "bss_user",
    password: "bss_password",
});

export const connectDB = async () => {
    try {
        // Проверим соединение (выполнив простой запрос)
        await pool.query("SELECT 1");
        console.log("✅ Успешное подключение к Postgres (через pg)");
    } catch (error) {
        console.error("❌ Ошибка подключения к Postgres:", error);
        throw error;
    }
};

// Функция для получения клиента / выполнения запросов
export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};
