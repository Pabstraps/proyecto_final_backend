const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository');

const cartController = {
  addCart: async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    try {
      const product = await productRepository.getProductById(productId);
      if (!product) {
        return res.status(404).send('Producto no encontrado');
      }

      let cart = await cartRepository.getCartByUserId(userId);

      if (!cart) {
        cart = await cartRepository.createCart({ userId, items: [], totalPrice: 0 });
      }

      const existingItem = cart.items.find(item => item.productId.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      cart.totalPrice += product.price * quantity;
      await cartRepository.updateCart(userId, cart);

      res.status(200).send(cart);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getCart: async (req, res) => {
    const { userId } = req.params;

    try {
      const cart = await cartRepository.getCartByUserId(userId);
      if (!cart) {
        return res.status(404).send('Carrito no encontrado');
      }

      res.status(200).send(cart);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  deleteCart: async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;

    try {
      let cart = await cartRepository.getCartByUserId(userId);

      if (!cart) {
        return res.status(404).send('Carrito no encontrado');
      }

      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex === -1) {
        return res.status(404).send('El producto no se encontró en el carrito');
      }

      cart.totalPrice -= cart.items[itemIndex].quantity * cart.items[itemIndex].productId.price;
      cart.items.splice(itemIndex, 1);

      cart = await cartRepository.updateCart(userId, cart);

      res.status(200).send(cart);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  clearCart: async (req, res) => {
    const { userId } = req.params;

    try {
      let cart = await cartRepository.getCartByUserId(userId);

      if (!cart) {
        return res.status(404).send('Carrito no encontrado');
      }

      cart.items = [];
      cart.totalPrice = 0;

      cart = await cartRepository.updateCart(userId, cart);

      res.status(200).send(cart);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
};

module.exports = cartController;
