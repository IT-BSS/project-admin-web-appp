import { Sequelize } from "sequelize";

<<<<<<< HEAD
// Получаем параметры подключения из переменных окружения
const dbName = process.env.DB_NAME || "webapp";
const dbUser = process.env.DB_USER || "postgres";
const dbPassword = process.env.DB_PASSWORD || "admin";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || 5432;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "postgres",
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
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
=======
const sequelize = new Sequelize(
  "postgres",
  "postgres",
  "qwer4123",
  {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: false, // убрать SQL в консоли
  }
);
>>>>>>> origin/dev_egor

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Successful connection to database.");
    console.log(`Database: ${dbHost}:${dbPort}/${dbName}`);
  } catch (error) {
    console.error("Couldn't connect to database:", error);
    // В продакшене можно добавить логику graceful shutdown
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

export default sequelize;
<<<<<<< HEAD
=======

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
>>>>>>> origin/dev_egor
