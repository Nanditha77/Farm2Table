const Order = require('../models/orderModel');

const orderCtrl = {
    createOrder: async (req, res) => {
        try {
            const { name, email, address, city, state, pincode, amount, paymentIntentId, paymentStatus } = req.body;

            const newOrder = new Order({
                name,
                email,
                address,
                city,
                state,
                pincode,
                amount,
                paymentIntentId,
                paymentStatus
            });

            await newOrder.save();
            res.json({ msg: "Order saved successfully", order: newOrder });
        } catch (err) {
            return res.status(500).json({ msg: err.message });

        }
    },


getOrderByPaymentIntent: async (req, res) => {
    try {
        const order = await Order.findOne({ paymentIntentId: req.params.paymentIntentId });
        if (!order) return res.status(400).json({ msg: "Order not found" });
        res.json({ order });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
},

getUserOrders: async (req, res) => {
    try {
      const userEmail = req.user.email;
      const orders = await Order.find({ email: userEmail }).sort({ createdAt: -1 });
      res.json(orders);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getFarmerOrders: async (req, res) => {
  try {
    const selleremail = req.user.email;
    const orders = await Order.find({ selleremail }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
},

updateOrderStatus: async (req, res) => {
  try {
    const { status } = req.body;
    const selleremail = req.user.email;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, selleremail },
      { deliveryStatus: status },
      { new: true }
    );

    if (!order)
      return res.status(403).json({ msg: 'Unauthorized or Order not found' });

    res.json({ msg: 'Delivery status updated', order });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

};

module.exports = orderCtrl;