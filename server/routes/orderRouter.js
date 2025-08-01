const router = require('express').Router();
const orderCtrl = require('../controllers/orderCtrl');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


router.post('/orders', orderCtrl.createOrder);
router.get('/order/payment/:paymentIntentId', orderCtrl.getOrderByPaymentIntent);
router.get('/user_orders', auth, orderCtrl.getUserOrders);
router.get('/farmer/orders', auth, authAdmin, orderCtrl.getFarmerOrders);
router.put('/farmer/orders/:id/status', auth, authAdmin, orderCtrl.updateOrderStatus);


module.exports = router;