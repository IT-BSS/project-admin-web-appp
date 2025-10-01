// routes/productCalculator.js
const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product/productController');

// Маршрут для отображения данных по id
router.get('/calculatorDetailed', productController.getProductColumns);

module.exports = router;