const { Op } = require('sequelize');
const ShortProduct = require('../../models/product/product.model');

const getProductFilters = async (req, res) => {
    const { query, location, propertyType, pricingRange, propertySize, buildYear, villa } = req.query;
    let whereClause = {};

    if (query) {
        whereClause.title = { [Op.like]: `%${query.trim()}%` };
    }
    if (location) {
        whereClause.location = location.trim();
    }
    if (propertyType) {
        whereClause.type = propertyType.trim();
    }
    // Обработка ввода цены: добавляем условие только если pricingRange является числом
    if (pricingRange && !isNaN(pricingRange)) {
        const priceLimit = parseInt(pricingRange, 10);
        if (priceLimit > 0) { // Добавляем условие только если число положительное
            whereClause.price = { [Op.lte]: priceLimit };
        }
    }
    if (propertySize) {
        whereClause.propertySize = propertySize.trim();
    }
    if (buildYear && !isNaN(buildYear)) {
        whereClause.buildYear = parseInt(buildYear, 10);
    }
    if (villa === 'true' || villa === 'false') {
        whereClause.villa = villa === 'true';
    }

    try {
        const products = await ShortProduct.findAll({
            where: whereClause,
            logging: console.log // Логирование SQL запроса
        });
        if (products.length === 0) {
            return res.status(404).json({ error: "Продукт не найден" });
        }
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { getProductFilters };
