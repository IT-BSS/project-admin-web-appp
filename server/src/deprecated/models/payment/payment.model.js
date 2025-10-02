//payment.model.js
const db = require('../../config/db.config.product');
const { logger } = require('../../utils/logger');

class PaymentModel {
  static addOrderToBD(user_id, payments_id, amountnum, products, cb) {
    const createPayment = 'INSERT INTO payment (user_id, payments_id, amountnum) VALUES (?, ?, ?)';

    db.query(createPayment, [user_id, payments_id, amountnum], (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }

      const payment_id = res.insertId;
      const productPromises = products.map(product => {
        const { image, name, price, color, quantity } = product;
        const createOrderProduct = 'INSERT INTO order_products (order_id, product_image, product_name, product_price, product_color, product_quantity, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';

        return new Promise((resolve, reject) => {
          db.query(createOrderProduct, [payment_id, image, name, price, color, quantity, user_id], (err, res) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(`Added product to order ${payment_id}:`);
          });
        });
      });

      Promise.all(productPromises)
        .then(() => {
          cb(null, {
            payment_id: payment_id,
            user_id: user_id,
            payments_id: payments_id,
            amountnum: amountnum
          });
        })
        .catch(err => {
          cb(err, null);
        });
    });
  }
}

module.exports = PaymentModel;
