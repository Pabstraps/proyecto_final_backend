const router = require('express').Router();
const categoryController = require('../controllers/categoryController.js')
const auth = require('../middlewares/auth.js')
const authAdmin = require('../middlewares/authAdmin.js')


router.route('/category')
.get(categoryController.getCategories)
.post(auth,authAdmin,categoryController.createCategory)

router.route('/category/:id')
.delete(auth,authAdmin,categoryController.deleteCategory)
.put(auth,authAdmin,categoryController.updateCategory)


module.exports = router