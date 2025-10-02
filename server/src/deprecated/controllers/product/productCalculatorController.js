const Product = require('../../models/product/product.model');

// Функция для получения столбцов из базы данных
async function getProductColumns() {
  try {
    const columns = await Product.findAll({
      attributes: ['id', 'name', 'image', 'kg_price', 'metr_price'],
    });
    return columns; // Вернуть результат запроса
  } catch (error) {
    console.log(error);
    throw error; // Обработка ошибок
  }
}

module.exports = {
  getProductColumns, // Экспортируем функцию
};