// routes/productRoutes.js
const express = require('express');
const router = express.Router();

const productController = require('../../controllers/product/productController');

// Маршрут для получения списка товаров
router.get('/ShortProducts', productController.getProducts);


module.exports = router;
