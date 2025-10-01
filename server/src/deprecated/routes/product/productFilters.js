// файл: routes/productFilters.js
const express = require('express');
const router = express.Router();
const { getProductFilters } = require('../../controllers/product/productFilters.controller'); // Импорт функции контроллера

// Маршрут для получения списка товаров
router.get('/productFilters', getProductFilters);

module.exports = router;
