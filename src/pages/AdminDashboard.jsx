import React, { useState } from "react";
import { User } from "lucide-react";

const AdminDashboard = () => {
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
  const [orders, setOrders] = useState([
    { id: 1, time: "10:00 AM", done: false },
    { id: 2, time: "10:30 AM", done: false },
    { id: 3, time: "11:00 AM", done: false },
  ]);

  const markOrderAsDone = (orderId) => {
    setOrders(
      orders.map(order =>
        order.id === orderId ? { ...order, done: true } : order
      )
    );
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center w-full max-w-md mb-4">
        <User className="w-6 h-6 cursor-pointer" />
        <h1 className="text-xl font-bold">ZEROX</h1>
      </div>

      {/* Start / Stop Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          className="btn btn-success w-1/2"
          onClick={() => setIsAcceptingOrders(true)}
        >
          Start
        </button>
        <button
          className="btn btn-error w-1/2"
          onClick={() => setIsAcceptingOrders(false)}
        >
          Stop
        </button>
      </div>

      {/* Orders List */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-4">
        <div className="card-body">
          <div className="flex justify-between items-center mb-2">
            <h2 className="card-title text-lg">Pending Orders</h2>
            <span className="badge badge-neutral">Total: {orders.length}</span>
          </div>

          {orders.map((order) => (
            <div
              key={order.id}
              className={`flex justify-between items-center p-2 mb-2 border rounded ${
                order.done ? "bg-green-300" : "bg-red-300"
              }`}
            >
              <span>Order #{order.id} - Due: {order.time}</span>
              <button
                onClick={() => markOrderAsDone(order.id)}
                className="btn btn-primary btn-sm"
              >
                {order.done ? "Completed" : "Done"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
