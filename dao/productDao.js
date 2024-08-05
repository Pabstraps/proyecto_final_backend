const Product = require('../models/productModel');

class ProductDao {
  async getById(productId) {
    return await Product.findById(productId);
  }

  async getByProductId(productId) {
    return await Product.findOne({ product_id: productId });
  }

  async updateSold(productId, quantity) {
    return await Product.findByIdAndUpdate(productId, { $inc: { sold: quantity } }, { new: true });
  }

  async getAll() {
    return await Product.find();
  }

  getAllQuery() {
    return Product.find();
  }

  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async update(productId, productData) {
    return await Product.findByIdAndUpdate(productId, productData, { new: true });
  }

  async delete(productId) {
    return await Product.findByIdAndDelete(productId);
  }
}

module.exports = new ProductDao();
