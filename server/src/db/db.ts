import { Sequelize } from "sequelize";

// Получаем параметры подключения из переменных окружения
const dbName = process.env.DB_NAME || "bss_database";
const dbUser = process.env.DB_USER || "bss_user";
const dbPassword = process.env.DB_PASSWORD || "bss_password";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || 5432;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort as number,
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // Дополнительные настройки для Docker
  dialectOptions: {
    connectTimeout: 60000, // 60 секунд таймаут для Docker
  },
  retry: {
    max: 3, // Количество попыток переподключения
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Successful connection to database.");
    console.log(`Database: ${dbHost}:${dbPort}/${dbName}`);
  } catch (error) {
    console.error("Couldn't connect to database:", error);
    // В продакшене можно добавить логику graceful shutdown
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

export default sequelize;

// import { Sequelize } from "sequelize";

// const sequelize = new Sequelize(
//   "webapp",
//   "postgres",
//   "admin",
//   {
//     host: "localhost",
//     port: 5432,
//     dialect: "postgres",
//     logging: false, // убрать SQL в консоли
//   }
// );

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Successful connection to database.");
//   } catch (error) {
//     console.error("Couldn't connect to database:", error);
//   }
// })();

// export default sequelize;
