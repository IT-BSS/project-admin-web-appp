import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "my_database",   
  "my_user",     
  "my_password",   
  {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: false, // убрать SQL в консоли
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Successful connection to database.");
  } catch (error) {
    console.error("Couldn't connect to database:", error);
  }
})();