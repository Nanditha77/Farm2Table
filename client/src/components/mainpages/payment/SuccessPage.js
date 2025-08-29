import {useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
    const [orderDetails,setOrderDetails] = useState({})
    const { id } = useParams();

useEffect(() => {
    const fetchOrder = async () => {
        try {
            const res = await axios.get(`https://farm2table-production.up.railway.app/api/order/payment/${id}`);
            setOrderDetails(res.data.order);
        } catch (err) {
            console.error(err);
        }
    };
    fetchOrder();
}, [id]);
   
    if (!orderDetails) return <p>Loading...</p>;

    return (
        <div className="success-container" style={{ padding: 20 }}>
            <h2>Payment Successful</h2>
            <p>Transaction ID: <b>{orderDetails.paymentIntentId}</b></p>

            <h3>Delivery Address:</h3>
            <p>{orderDetails.name}</p>
            <p>{orderDetails.address}</p>
            <p>{orderDetails.city} {orderDetails.state} - {orderDetails.zip}</p>
            <p>Email: {orderDetails.email}</p>
        </div>
    );
};

export default SuccessPage;