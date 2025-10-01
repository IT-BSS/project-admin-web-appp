import sequelize from "./db/db";
import app from "./app";

const PORT = 3001;
const HOST = '0.0.0.0'; // Что бы можно было принимать запросы с мобилки

sequelize.authenticate()
  .then(() => {
    console.log('DB connected');
    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  })
  .catch(err => console.error('DB connection error:', err));