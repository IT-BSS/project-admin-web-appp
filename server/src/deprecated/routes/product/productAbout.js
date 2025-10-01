// routes/catalog.js
const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product/productController');

// Маршрут для отображения данных по id
router.get('/:id', productController.getProductById);
module.exports = router;