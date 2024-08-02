const Order = require('../models/orderModel.js');
const Cart = require('../models/cartModel.js');
const Product = require('../models/productModel.js');
const User = require('../models/userModel.js');
const { sendOrderEmail } = require('../config/mailer.js');


const generateticket = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price
    }));

    const order = new Order({
      userId,
      items: orderItems,
      totalPrice: cart.totalPrice
    });

    await order.save();

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { sold: item.quantity } });
    }

    await Cart.findOneAndDelete({ userId });

    const user = await User.findById(userId);

    sendOrderEmail(user, order);

    res.status(200).send({ message: 'La compra ha sido completada!', order });
  } catch (error) {
    res.status(500).send(error.message);
  }
};


module.exports = { generateticket };
