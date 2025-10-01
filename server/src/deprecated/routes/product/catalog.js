const express = require('express');
const router = express.Router();

// Подключаем контроллеры фильтрации и сортировки
const filtersController = require('../../controllers/product/filters.controller');
const sortingController = require('../../controllers/product/sorting.controller');

// Маршруты для фильтрации и сортировки
router.use('/filter', filtersController.GetFilters);
// router.use('/sort', sortingController.GetSorting);

module.exports = router;
