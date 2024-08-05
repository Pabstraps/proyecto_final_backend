const orderDao = require('../dao/orderDao');

class OrderRepository {
  async getOrdersByUserId(userId) {
    return await orderDao.getByUserId(userId);
  }

  async createOrder(orderData) {
    return await orderDao.createOrder(orderData);
  }

  async updateOrder(orderId, orderData) {
    return await orderDao.updateOrder(orderId, orderData);
  }

  async deleteOrder(orderId) {
    return await orderDao.deleteOrder(orderId);
  }
}

module.exports = new OrderRepository();
