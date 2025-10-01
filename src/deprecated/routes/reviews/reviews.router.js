// reviews.router.js
const express = require('express');
const router = express.Router();

const reviewsController = require('../../controllers/reviews/reviews.controller');

router.route('/reviews')
    .get(reviewsController.getReviews);

module.exports = router;
