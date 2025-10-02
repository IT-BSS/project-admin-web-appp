const { Op } = require('sequelize');
const Product = require('../../models/product/product.model');

// Объект с функциями сортировки
const sortFunctions = {
  'По новизне': (filterConditions) => ({ order: [['createdAt', 'DESC']], where: filterConditions }),
  'По цене↑': (filterConditions) => ({ order: [['price', 'ASC']], where: filterConditions }),
  'По цене↓': (filterConditions) => ({ order: [['price', 'DESC']], where: filterConditions }),
  'По качеству': (filterConditions) => ({ order: [['quality', 'DESC']], where: filterConditions }),
  'Тип полотна': (filterConditions) => ({ order: [['type_of_canvas', 'ASC']], where: filterConditions }),
};

exports.GetFilters = async (req, res) => {
  try {
    const { price, size, color, type_of_canvas, sort } = req.query;

    const decodedPrice = decodeURIComponent(price || '');
    const decodedTypeOfCanvas = decodeURIComponent(type_of_canvas || '');
    const decodedSize = decodeURIComponent(size || '');
    const decodedColor = decodeURIComponent(color || '');

    // Создайте объект с условиями для фильтрации
    const filterConditions = {};

    if (decodedTypeOfCanvas) {
      filterConditions.type_of_canvas = decodedTypeOfCanvas;
    }

    if (decodedSize) {
      filterConditions.size = decodedSize;
    }
    
    if (decodedColor) {
      filterConditions.color = decodedColor;
    }

    if (decodedPrice) {
      filterConditions.price = {
        [Op.lte]: parseInt(decodedPrice), // Изменили parseFloat на parseInt
      };
    }

    let sortedProducts = [];

    if (sort != null) {
      // Используем функцию сортировки из объекта sortFunctions
      const sortKey = sort || 'default';
      const sortOptions = sortFunctions[sortKey](filterConditions);

      // Получаем отсортированные товары
      sortedProducts = await Product.findAll({
        where: filterConditions,
        ...sortOptions,
      });
    } else {
      // Если сортировка не указана, получаем только отфильтрованные товары без пагинации
      sortedProducts = await Product.findAll({
        where: filterConditions,
      });
    }

    res.json(sortedProducts);

  } catch (error) {
    console.error('Ошибка при обработке запроса фильтрации:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
};
