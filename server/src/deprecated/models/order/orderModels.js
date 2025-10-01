//order.model.js
const db = require('../../config/db.config.product');
const { logger } = require('../../utils/logger');

class orderModel {
    constructor(user_id) {
        this.user_id = user_id
    }
    static async getOrderByUserId(user_id, res) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM order_products WHERE user_id;', [user_id], (err, results) => {
                resolve(results)
                reject(err)
            });
        });
    }
}

module.exports = orderModel;