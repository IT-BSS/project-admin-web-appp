// paymentRoutes.js
const router = require('express').Router();
const { asyncHandler } = require('../../middlewares/asyncHandler');
const { verifyToken } = require('../../middlewares/auth/VerifyToken');
const { createPay } = require('../../controllers/payment/paymentController')

router.route('/createPayment')
  .post(asyncHandler(verifyToken), asyncHandler(createPay))

module.exports = router;