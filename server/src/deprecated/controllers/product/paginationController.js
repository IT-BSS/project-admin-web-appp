const Product = require('../../models/product/product.model');

exports.getPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Получаем номер страницы из параметров запроса, если не указан, то используем 1
    const itemsPerPage = 9; // Количество элементов на странице (можно настроить по вашему усмотрению)

    // Рассчитываем смещение для выборки данных из базы
    const offset = (page - 1) * itemsPerPage;

    // Добавляем фильтры и сортировку здесь, если необходимо
    // Пример фильтрации по типу полотна:
    // const typeOfCanvas = req.query.type_of_canvas;
    // const filter = typeOfCanvas ? { type_of_canvas: typeOfCanvas } : {};

    // Получаем данные с учетом смещения и количества элементов на странице
    const products = await Product.findAll({
      // where: filter, // Если есть фильтры, добавьте их здесь
      offset: offset,
      limit: itemsPerPage,
    });

    // Рассчитываем общее количество страниц на основе общего количества товаров
    const totalProducts = await Product.count(); // Получаем общее количество товаров в базе данных
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    res.json({
      products: products,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error('Ошибка при получении страницы товаров:', error);
    res.status(500).json({ error: 'Ошибка при получении страницы товаров' });
  }
};
