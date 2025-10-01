// paymentRoutes.js
const router = require('express').Router();
const { asyncHandler } = require('../../middlewares/asyncHandler');
const { verifyToken } = require('../../middlewares/auth/VerifyToken');
const { orderController } = require('../../controllers/order/orderController')

router.route('/list')
    .get(asyncHandler(verifyToken), asyncHandler(orderController))

module.exports = router;