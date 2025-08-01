const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: String,
    state: String,
    productname: { type: String, required: true },
    pincode: Number,
    selleremail:{ type: String, required: true },
    amount: { type: Number, required: true },
    paymentIntentId: { type: String, required: true },
    paymentStatus: { type: String, required: true, default: 'pending' },
    deliveryStatus: {
        type: String,
        default: 'Pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);