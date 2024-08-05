const productDao = require('../dao/productDao');

class ProductRepository {
  async getProductById(productId) {
    return await productDao.getById(productId);
  }

  async getProductByProductId(productId) {
    return await productDao.getByProductId(productId);
  }

  async updateProductSold(productId, quantity) {
    return await productDao.updateSold(productId, quantity);
  }

  async getAllProducts() {
    return await productDao.getAll();
  }

  getAllProductsQuery() {
    return productDao.getAllQuery();
  }

  async createProduct(productData) {
    return await productDao.create(productData);
  }

  async updateProduct(productId, productData) {
    return await productDao.update(productId, productData);
  }

  async deleteProduct(productId) {
    return await productDao.delete(productId);
  }
}

module.exports = new ProductRepository();
