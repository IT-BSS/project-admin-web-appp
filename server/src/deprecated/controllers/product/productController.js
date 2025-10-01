// controllers/productController.js
const ShortProduct = require('../../models/product/product.model');
const productAbout = require('./productAbout.controller')
// Контроллер для получения списка товаров
exports.getProducts = async (req, res) => {
  try {
    const products = await ShortProduct.findAll();
    res.json(products);
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    res.status(500).json({ error: 'Ошибка при получении товаров' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id; // Получаем id из параметра запроса
    console.log(productId)
    const product = await ShortProduct.findByPk(productId); // Ищем продукт по id в базе данных

    if (!product) {
      return res.status(404).json({ error: 'Продукт не найден' });
    }

    await productAbout.getProductAndImagesById(productId, res); // Замените 'id' на 'productId'

    // Отправляем найденный продукт в ответе
    // return res.json(product);
  } catch (error) {
    console.error('Ошибка при получении данных по id:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};



exports.getProductColumns = async (req, res) => {
  try {
    const columns = await ShortProduct.findAll({
      attributes: ['id', 'name', 'image'],
    });
    res.json(columns); // Вернуть результат запроса
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
};





