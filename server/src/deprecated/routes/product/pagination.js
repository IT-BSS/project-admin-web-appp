const express = require('express');
const router = express.Router();
const paginationController = require('../../controllers/product/paginationController');

// Роут для получения товаров с пагинацией
router.get('/page', paginationController.getPage);


module.exports = router;
