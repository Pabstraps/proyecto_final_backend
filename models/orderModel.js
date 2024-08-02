const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
    productId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Products'},
      quantity: Number,
      price: Number
  });
  
  const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
      items: [orderItemSchema],
      totalPrice: Number,
      createdAt: { type: Date, default: Date.now }
  });
  
  
module.exports = mongoose.model('Order', orderSchema)