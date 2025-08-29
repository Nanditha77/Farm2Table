import React, { useState, useEffect, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';


const CheckoutForm = ({product}) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const state = useContext(GlobalState);
    const [cart,setCart] = state.UserAPI.cart;
    const [quantity,setQuantity] = useState(1);

    const [clientSecret, setClientSecret] = useState('');
    const [address, setAddress] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    const productname= product.product.title
    const amount = product.product.price * quantity; 
    const selleremail=product.product.farmeremail; 

    useEffect(() => {
        fetch('https://farm2table-production.up.railway.app/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, selleremail, productname, shipping: address })
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret))
            .catch(eror => alert(eror.message));
    }, [address]);

   

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: address.name,
                    email: address.email,
                    address: {
                        line1: address.address,
                        city: address.city,
                        state: address.state,
                        postal_code: address.pincode,
                        country: 'US'
                    }
                }
            }
        });

        if (error) {
            alert(`❌ Payment Failed: ${error.message}`);
        } else {
            if (paymentIntent.status === 'succeeded') {
                const updatedCart = cart.filter(item => item.product.product_id !==product.product.product_id)
                setCart(updatedCart)
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                navigate(`/success/${paymentIntent.id}`);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: 'auto' }}>
            <h3>Delivery Details</h3>
            <input placeholder="Name" value={address.name} required
                onChange={e => setAddress({ ...address, name: e.target.value })} /><br />
            <input placeholder="Email" value={address.email} required
                onChange={e => setAddress({ ...address, email: e.target.value })} /><br />
            <input placeholder="Address" value={address.address} required
                onChange={e => setAddress({ ...address, address: e.target.value })} /><br />
            <input placeholder="City" value={address.city} required
                onChange={e => setAddress({ ...address, city: e.target.value })} /><br />
            <input placeholder="State" value={address.state} required
                onChange={e => setAddress({ ...address, state: e.target.value })} /><br />
            <input placeholder="Pin Code" value={address.pincode} required
                onChange={e => setAddress({ ...address, pincode: e.target.value })} /><br />

            <button type='button' onClick={()=>setQuantity(q=>Math.max(1,q-1))}>-</button>
            <input type='number' min="1" value={quantity} style={{ width: 70, textAlign: 'center', margin: '0 10px' }} />
            <button  type='button' onClick={()=>setQuantity(q=>q+1)}>+</button>

            <h3>Card Details</h3>
            <div style={{ border: '1px solid gray', padding: 10 }}>
                <CardElement />
            </div>
            <button disabled={!stripe || !elements || !clientSecret } style={{ marginTop: 20 }}>
                Pay ${amount}
            </button>
        </form>
    );
};

export default CheckoutForm;
