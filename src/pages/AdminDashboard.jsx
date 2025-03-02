import React, { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import AdminLogoutButton from "./AdminLogoutButton";
import useAdmin from "../hooks/useAdmin";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Store the selected orderId
  const [selectedStatus, setSelectedStatus] = useState(""); // Store the selected order status

  const { admin } = useAdmin();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("Empty")); // Get user info

        if (!user || !user.token) {
          toast.error("You need to log in first!");
          return;
        }
        const response = await fetch("http://localhost:5000/api/admin/orders", {
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

  // Handle the confirmation logic for marking an order as complete
  const markOrderAsDone = (orderId, status) => {
    setSelectedStatus(status); // Set the correct status (Pending or Completed)
    setSelectedOrderId(orderId); // Store the selected orderId
    setIsModalOpen(true); // Open the modal
  };

  const AcceptOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("Empty")); // Get user info

      if (!user || !user.token) {
        toast.error("You need to log in first!");
        return;
      }
      const response = await fetch(`http://localhost:5000/api/admin/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("services started");
      } else {
        toast.error(data.message || "some error occured in admin controller");
      }
    } catch (error) {
      console.error("service error:", error);
      toast.error("Network error. Try again later.");
    }
  };

  const RejectOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("Empty")); // Get user info

      if (!user || !user.token) {
        toast.error("You need to log in first!");
        return;
      }
      const response = await fetch(`http://localhost:5000/api/admin/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("services stopped");
      } else {
        toast.error(data.message || "some error occured in admin controller");
      }
    } catch (error) {
      console.error("service error:", error);
      toast.error("Network error. Try again later.");
    }
  };

  // Function to handle confirmation (OK)
  const handleConfirm = async () => {
    try {
      await admin(selectedOrderId, selectedStatus); // Call the admin hook to update status
      setIsModalOpen(false); // Close modal after confirming
    } catch (error) {
      // If something goes wrong, you can handle it here (e.g., show a toast error)
      console.error(error.message);
    }
  };

  // Function to handle cancellation (Cancel)
  const handleCancel = () => {
    setIsModalOpen(false); // Close modal if cancelled
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-between items-center w-full max-w-4xl mb-4">
        <AdminLogoutButton className="w-6 h-6 cursor-pointer" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          className="btn btn-success w-1/2"
          onClick={() => AcceptOrders()}
        >
          Start
        </button>
        <button className="btn btn-error w-1/2" onClick={() => RejectOrders()}>
          Stop
        </button>
      </div>

      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="w-full border-collapse border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User</th>
              <th className="border p-2">Files</th>
              <th className="border p-2">File Links</th>
              <th className="border p-2">Number of Copies</th>
              <th className="border p-2">Printing Type</th>
              <th className="border p-2">Color</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Record Papers</th>
              <th className="border p-2">Front Papers</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className={
                  order.status === "Completed" ? "bg-green-400" : "bg-red-400"
                }
              >
                <td className="border p-2">{order.user.username}</td>
                <td className="border p-2">{order.files.length}</td>
                <td className="border p-2">
                  {order.files.map((file, index) => (
                    <a
                      key={index}
                      href={`http://localhost:5000/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="btn m-2">File {index + 1}</button>
                    </a>
                  ))}
                </td>
                <td className="border p-2">{order.copyNumber}</td>
                <td className="border p-2">{order.printType}</td>
                <td className="border p-2">{order.colorOption}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">{order.recordPapers}</td>
                <td className="border p-2">
                  {Object.entries(order.departments).map(([key, value]) => (
                    <div key={key}>
                      {key}: {value}
                    </div>
                  ))}
                </td>
                <td className="border p-2">
                  {order.status === "Completed" ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => markOrderAsDone(order._id, "Pending")}
                    >
                      Mark as Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => markOrderAsDone(order._id, "Completed")}
                      className="btn btn-primary btn-sm"
                    >
                      Mark as Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the Confirm Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        message={`Are you sure you want to mark this order as ${selectedStatus}?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminDashboard;
