const orderRepository = require('../repositories/orderRepository');
const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository');
const userRepository = require('../repositories/userRepository');
const { sendOrderEmail } = require('../config/mailer');

const orderController = {
  generateticket: async (req, res) => {
    const { userId } = req.params;

    try {
      const cart = await cartRepository.getCartByUserId(userId);
      if (!cart) {
        return res.status(404).send('Carrito no encontrado');
      }

      const orderItems = cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      }));

      const order = await orderRepository.createOrder({
        userId,
        items: orderItems,
        totalPrice: cart.totalPrice
      });

      // Actualizar conteo de unidades vendidas
      for (const item of orderItems) {
        await productRepository.updateProduct(item.productId, { $inc: { sold: item.quantity } });
      }

      // Limpiar carrito
      await cartRepository.deleteCart(userId);

      // Enviar Email
      const user = await userRepository.getUserById(userId);
      sendOrderEmail(user, order);

      res.status(200).send({ message: 'La compra ha sido completada!', order });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
};

module.exports = orderController;

