import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';

const History = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isAdmin] = state.UserAPI.isAdmin
  const [history, setHistory] = useState([]);
  const [orders, setOrders] =useState([])

  useEffect(() => {
    const getHistory = async () => {
      try {
        const res = await axios.get('/api/user_orders', {
          headers: { Authorization: token }
        });
        setHistory(res.data);
      } catch (err) {
        alert(err.response.data.msg);
      }
    };
    getHistory();
  }, [token]);

  useEffect(() => {
    axios.get('/api/farmer/orders', {
      headers: { Authorization: token }
    }).then(res => setOrders(res.data))
    .catch(eror => console.log(eror));
  }, [token]);

  const updateStatus = async (id, status) => {
    await axios.put(`/api/farmer/orders/${id}/status`, { status }, {
      headers: { Authorization: token }
    });
    setOrders(orders.map(o => o._id === id ? { ...o, deliveryStatus: status } : o));
  };

  return (
    <>
    {isAdmin ? (
       <div className="p-4 space-y-4 border rounded shadow mt-8 ">
       <h2 className='text-2xl font-bold mb-2'>My Harvest Sales</h2>
      {orders.map(order => (
        <div key={order._id} className="border p-4 bg-green-100 rounded shadow">
          <p className='uppercase'><strong>Product:</strong> {order.productname}</p>
          <p><strong>Amount:</strong> ₹{order.amount}</p>
          <p><strong>Buyer:</strong> {order.address}, {order.city}, {order.state} - {order.pincode}</p>
          <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Last updated delivery status: </strong> {order.deliveryStatus}</p>
          <strong>Update Status:</strong> <input
            className="mt-2 border px-2 py-1"
            onChange={e => updateStatus(order._id, e.target.value)}
          />
        </div>
      ))}
    </div>
    ) : (
      <div className="px-4 py-6 bg-gray-100 min-h-screen">
  <h2 className="text-2xl font-bold mb-2">Order History</h2>
  <h4 className="text-gray-600 mb-6">You have {history.length} orders</h4>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {history.map((order) => (
      <div
        key={order._id}
        className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-shadow border border-gray-200"
      >
        <h3 className="text-xl font-semibold text-indigo-600 uppercase mb-2">{order.productname}</h3>
        
        <div className="space-y-1 text-sm text-gray-700">
          <p><span className="font-medium text-gray-800">Amount:</span> ₹{order.amount}</p>
          <p>
            <span className="font-medium text-gray-800">Payment Status:</span>{" "}
            <span
              className={`inline-block px-2 py-0.5 rounded text-white text-xs ${
                order.paymentStatus === "Succeeded" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {order.paymentStatus}
            </span>
          </p>
          <p><span className="font-medium text-gray-800">Ordered On:</span> {new Date(order.createdAt).toLocaleString()}</p>
          <p><span className="font-medium text-gray-800">Delivery Status:</span> {order.deliveryStatus}</p>
        </div>
      </div>
    ))}
  </div>
</div>

    ) 
    }
    </>
  );
};

export default History;