import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import io from "socket.io-client";

const user = JSON.parse(localStorage.getItem("print-user"));
const socket = io("http://localhost:5001",{
  withCredentials: true,
  auth: {
    token: user.token, 
  },
});

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/orders/slots");
        if (!response.ok) throw new Error("Failed to fetch slots");
        const data = await response.json();
        setSlots(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchSlots();
    const interval = setInterval(fetchSlots, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("orderCountUpdate", (count) => {
      console.log("📥 Received updated order count:", count); // Debugging log
      setTotalOrders(count);
    });
  
    return () => {
      socket.off("orderCountUpdate");
    };
  }, []);  

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
      <p className="text-lg mt-2">Ongoing Orders: {totalOrders}</p>
      <div className="grid grid-cols-4 gap-4">
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg text-white ${
              slot.count >= 10 ? "bg-red-600" : "bg-green-500"
            }`}
          >
            <p>
              {new Date(slot.start).toLocaleTimeString()} -{" "}
              {new Date(slot.end).toLocaleTimeString()}
            </p>
            <p>Orders: {slot.count}</p>
          </div>
        ))}
      </div>
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
                <td className="border p-2">{order.estimatedTime/60}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;