const User = require('../models/userModel');

class UserDao {
  async getById(userId, selectFields = '') {
    return await User.findById(userId).select(selectFields);
  }

  async getByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async updateUser(userId, userData) {
    return await User.findByIdAndUpdate(userId, userData, { new: true });
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }

  async getAllUsers() {
    return await User.find();
  }
}

module.exports = new UserDao();
