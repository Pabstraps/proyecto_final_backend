const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const sendOrderEmail = (user, order) => {
  const mailOptions = {
    from: process.env.GMAIL_ACCOUNT,
    to: user.email,
    subject: 'Tu resumen de pedido',
    text: `Hola! ${user.name},\n\nGracias por tu compra! \nAqui los detalles de tu pedido:\n\n${order.items.map(item => `Producto: ${item.productId.title}\nCantidad: ${item.quantity}\nPrecio: ${item.price}`).join('\n\n')}\n\nPrecio total: ${order.totalPrice}\n\nBonito dia!,\nE-commerce Team`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { sendOrderEmail };
