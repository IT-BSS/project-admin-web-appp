import sequelize from "./db/db";
import app from "./app";
import { setupAssociations } from "./models/associations/associations";

const PORT = 3000;
const HOST = '0.0.0.0'; // Чтобы можно было принимать запросы с мобилки

// Настройка связей между таблицами
setupAssociations();

// Чтобы при изменениях в таблицах (добавление/удаление новых свойств у сущностей)
// таблицы изменялись и в базе данных
sequelize.sync({ alter: true }); 

sequelize.authenticate()
  .then(() => {
    console.log('DB connected');
    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  })
  .catch(err => console.error('DB connection error:', err));