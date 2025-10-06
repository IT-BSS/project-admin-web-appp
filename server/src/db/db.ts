import { Sequelize } from "sequelize";

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

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Successful connection to database.");
  } catch (error) {
    console.error("Couldn't connect to database:", error);
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