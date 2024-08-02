const router = require('express').Router();
const { generateticket } = require('../controllers/orderController');
const auth = require ('../middlewares/auth')


router.post('/:userId/generateticket', auth, generateticket);


module.exports = router