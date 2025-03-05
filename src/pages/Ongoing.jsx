import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("print-user"));

        if (!user || !user.token) {
          toast.error("You need to log in first!");
          return;
        }
        const response = await fetch("http://localhost:5001/api/orders/ongoing-orders", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="w-full border-collapse border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Submitted Time</th>
              <th className="border p-2">Estimated Time (min)</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="bg-white">
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="border p-2">{order.estimatedTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
