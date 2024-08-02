const router = require('express').Router();
const productController = require('../controllers/productController.js')
const auth = require('../middlewares/auth.js')
const authAdmin = require('../middlewares/authAdmin.js')

router.route('/products')
.get(productController.getProducts)
.post(auth,authAdmin,productController.createProduct)

router.route('/products/:id')
.delete(auth,authAdmin,productController.deleteProduct)
.put(auth,authAdmin,productController.updateProduct)


module.exports = router;