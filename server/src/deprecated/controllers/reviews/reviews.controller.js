// controllers/reviews.controller.js
const Reviews = require('../../models/reviews/reviews.model');

// Контроллер для получения списка отзывов
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Reviews.findAll();
        res.json(reviews);
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
        res.status(500).json({ error: 'Ошибка при получении отзывов' });
    }
};
