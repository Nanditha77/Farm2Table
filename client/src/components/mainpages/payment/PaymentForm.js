import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { useLocation } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const PaymentForm = () => {
    const location = useLocation();
    const product = location.state.product;
    return (
        <div>
            <h2 style={{ textAlign: 'center' }} className='text-2xl' >Secure Payment</h2>
            <Elements stripe={stripePromise}>
                <CheckoutForm product={product} />
            </Elements>
        </div>
    );
};

export default PaymentForm;