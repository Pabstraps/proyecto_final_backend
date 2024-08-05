const Order = require('../models/orderModel');

class OrderDao {
  async getByUserId(userId) {
    return await Order.find({ userId }).populate('items.productId');
  }

  async createOrder(orderData) {
    const order = new Order(orderData);
    return await order.save();
  }

  async updateOrder(orderId, orderData) {
    return await Order.findByIdAndUpdate(orderId, orderData, { new: true });
  }

  async deleteOrder(orderId) {
    return await Order.findByIdAndDelete(orderId);
  }
}

module.exports = new OrderDao();

