const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
  quantity: Number
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  items: [cartItemSchema],
  totalPrice: Number
});



module.exports = mongoose.model('Cart', cartSchema);

