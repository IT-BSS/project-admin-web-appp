const PaymentUtils = require('../controllers/payment/paymentController');

const createPay = async (req, res, next) => {
  const public_key = '6jng7ro9uteki2y';
  const shop_id = '3942';
  const payment = new PaymentUtils(public_key, shop_id);

  const amount = req.body.total;
  try {
    let result = await payment.createPay(amount, res)
    console.log(result);
  } catch(err) {
    console.error(err);
    next(err);
  }
}

module.exports = {
  createPay,
};