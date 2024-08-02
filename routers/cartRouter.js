const router = require('express').Router()
const cartController = require ('../controllers/cartController.js')
const auth = require('../middlewares/auth.js')


router.post('/:userId/add', auth, cartController.addCart)
router.get('/:userId', auth, cartController.getCart)
router.post('/:userId/remove', auth, cartController.deleteCart)
router.post('/:userId/clear', auth, cartController.clearCart)

module.exports = router