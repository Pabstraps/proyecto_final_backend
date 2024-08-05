const cartDao = require('../dao/cartDao');

class CartRepository {
  async getCartByUserId(userId) {
    return await cartDao.getByUserId(userId);
  }

  async createCart(cartData) {
    return await cartDao.createCart(cartData);
  }

  async updateCart(userId, cartData) {
    return await cartDao.updateCart(userId, cartData);
  }

  async deleteCart(userId) {
    return await cartDao.deleteCart(userId);
  }
}

module.exports = new CartRepository();
