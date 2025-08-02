require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const Stripe = require('stripe');
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const chatRoute = require('./routesin/chat');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


const cors = require('cors');
app.use(cors({
  origin: 'https://farm2table-client.vercel.app/',
  credentials: true
}));


app.use(cookieParser())
app.use(fileUpload({
    useTempFiles:true
}))

const Order = require('./models/orderModel');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const PORT= process.env.PORT || 5000; // ek port bana lete hai , jis port pe ye khulega

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata;
        const addressParts = metadata.address ? metadata.address.split(',') : [];

        const order = new Order({
            name: metadata.name,
            email: metadata.email,
            address: addressParts[0] || '',
            city: addressParts[1] || '',
            state: addressParts[2] || '',
            zip: addressParts[3] || '',
            amount: paymentIntent.amount / 100,
            paymentIntentId: paymentIntent.id,
            productname:metadata.productname,
            selleremail:metadata.selleremail,
            paymentStatus: 'succeeded'
        });

        await order.save();
        console.log('✅ Order saved from webhook:', order);
    }

    res.send();
});

app.use(express.json())

app.get('/',(req,res)=>{
    res.json({msg:"This is Example"})
})

app.listen(PORT,()=>{
    console.log("Server is Running ....");  
})

app.post('/create-payment-intent', async (req, res) => {
    const { amount, selleremail, productname, shipping } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            metadata: {
                name: shipping.name,
                email: shipping.email,
                productname: productname,
                selleremail:selleremail,
                address: `${shipping.address}, ${shipping.city}, ${shipping.state}, ${shipping.pincode}` 
            }
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.use('/api', require('./routes/orderRouter'));
app.use('/user', require('./routes/useRouter') )
app.use('/api', require('./routes/categoryRouter') )
app.use('/api', require('./routes/productRouter') )
app.use('/api',require('./routes/upload'))
app.use('/api/chat', chatRoute);

const URI = process.env.MONGODB_URL;

mongoose.connect(URI,{
  serverSelectionTimeoutMS: 5000,
  family: 4 // Use IPv4, skip trying IPv6
 }  // update kardenge single update 
 ).then(()=>{
    console.log("MongoDB connected");
}).catch(eror=>{
    console.log(eror);
})

// registeration page banayenge, aur registration page se ham data base ko kuch bejenge

