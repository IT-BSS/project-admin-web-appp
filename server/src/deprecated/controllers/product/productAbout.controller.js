// ProductAbout.controller.js
const ShortProduct = require('../../models/product/product.model'); // Подключаем модели
const ProductImage = require('../../models/product/productAbout.model'); // Подключаем модели

// Метод для получения информации о товаре и его изображениях по id
exports.getProductAndImagesById = async (productId, res) => {
  try {
    // Получаем информацию о товаре из таблицы products
    const product = await ShortProduct.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    // Получаем изображения товара из таблицы products_img
    const images = await ProductImage.findAll({ where: { ShortProducts_id: productId } });

    // Отправляем информацию о товаре и его изображениях на клиент
    res.json({ product, images });
  } catch (error) {
    console.error('Ошибка при получении данных о товаре:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

