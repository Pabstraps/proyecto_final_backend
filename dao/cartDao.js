const Cart = require('../models/cartModel');

class CartDao {
  async getByUserId(userId) {
    return await Cart.findOne({ userId }).populate('items.productId');
  }

  async createCart(cartData) {
    const cart = new Cart(cartData);
    return await cart.save();
  }

  async updateCart(userId, cartData) {
    return await Cart.findOneAndUpdate({ userId }, cartData, { new: true });
  }

  async deleteCart(userId) {
    return await Cart.findOneAndDelete({ userId });
  }
}

module.exports = new CartDao();
