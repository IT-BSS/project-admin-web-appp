const {userIdByToken} = require('../../utils/token')
const orderModel = require('../../models/order/orderModels')

async function orderController(req, res) {
    try{
        const token = req.user;
        const user_id = userIdByToken(token)

        const allOrders = await orderModel.getOrderByUserId(user_id, res)
        return res.status(200).json(allOrders);
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    orderController,
};