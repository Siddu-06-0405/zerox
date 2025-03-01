import React, { useEffect, useState } from "react";
import { User } from "lucide-react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/orders", { // ✅ Fixed API URL
          method: "GET",
          headers: {
            "Authorization": "Basic " + btoa("admin:123456"),
          },
          credentials: "include",
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

  const markOrderAsDone = (orderId) => {
    setOrders(orders.map((order) =>
      order._id === orderId ? { ...order, status: "Completed" } : order
    ));
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-between items-center w-full max-w-4xl mb-4">
        <User className="w-6 h-6 cursor-pointer" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="flex space-x-4 mb-4">
        <button className="btn btn-success w-1/2" onClick={() => setIsAcceptingOrders(true)}>Start</button>
        <button className="btn btn-error w-1/2" onClick={() => setIsAcceptingOrders(false)}>Stop</button>
      </div>

      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="w-full border-collapse border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User</th>
              <th className="border p-2">Files</th>
              <th className="border p-2">Copies</th>
              <th className="border p-2">Print Type</th>
              <th className="border p-2">Color</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className={order.status === "Completed" ? "bg-green-200" : ""}>
                <td className="border p-2">{order.user.username}</td>
                <td className="border p-2">{order.files.length}</td>
                <td className="border p-2">
                  {order.files.map((file, index) => (
                    <a key={index} href={`http://localhost:5000/${file}`} target="_blank" rel="noopener noreferrer">
                      {/* <//http://your-vps-ip:5000/uploads/1740825826100.pdf/> */}
                      <button className="btn m-2">File {index + 1}</button>
                    </a>
                  ))}
                </td>
                <td className="border p-2">{order.copyNumber}</td>
                <td className="border p-2">{order.printType}</td>
                <td className="border p-2">{order.colorOption}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">
                  {order.status !== "Completed" ? (
                    <button onClick={() => markOrderAsDone(order._id)} className="btn btn-primary btn-sm">
                      Complete
                    </button>
                  ) : (
                    <span className="text-green-600 font-bold">Done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
