const Product = require('../../models/product/product.model');
const { Op } = require('sequelize');

// Обновленный код функции sortProducts
const sortProducts = async (sort) => {
  switch (sort) {
    case 'По новизне':
      return await Product.findAll({
        order: [['createdAt', 'DESC']],
      });
    case 'По цене↑':
      return await Product.findAll({
        order: [['price', 'ASC']],
      });
    case 'По цене убывание↓':
      return await Product.findAll({
        order: [['price', 'DESC']],
      });
    case 'По качеству':
      return await Product.findAll({
        order: [['quality', 'DESC']], // Замените 'quality' на поле, по которому вы хотите сортировать по качеству
      });
    case 'Тип полотна':
      return await Product.findAll({
        order: [['type_of_canvas', 'ASC']], // Замените 'type_of_canvas' на поле, по которому вы хотите сортировать по типу полотна
      });
    default:
      // По умолчанию, если sort не указан или неизвестен
      return await Product.findAll();
  }
};

// Обновленный код функции GetSorting
exports.GetSorting = async (res, req) => {
  try {
    const { sort } = req.query;
    console.log('sort from sorting === ',sort); // undefined
    // Вызываем функцию для сортировки
    const sortedProducts = await sortProducts(sort);

    // Отправляем отфильтрованные и отсортированные продукты в ответе
    res.json({
      sortedProducts,
    });
  } catch (error) {
    console.error('Ошибка при обработке запроса фильтрации и сортировки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
