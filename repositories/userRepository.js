const userDao = require('../dao/userDao');

class UserRepository {
  async getUserById(userId, selectFields = '') {
    return await userDao.getById(userId, selectFields);
  }

  async getUserByEmail(email) {
    return await userDao.getByEmail(email);
  }

  async createUser(userData) {
    return await userDao.createUser(userData);
  }

  async updateUser(userId, userData) {
    return await userDao.updateUser(userId, userData);
  }

  async deleteUser(userId) {
    return await userDao.deleteUser(userId);
  }

  async getAllUsers() {
    return await userDao.getAllUsers();
  }
}

module.exports = new UserRepository();
