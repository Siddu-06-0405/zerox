import React, { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import AdminLogoutButton from "./AdminLogoutButton";
import useAdmin from "../hooks/useAdmin";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001", {
  transports: ["websocket", "polling"],
  withCredentials: true,
  auth: {
    role: "admin", // Sending the admin role in headers
  },
});

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [otpVisibility, setOtpVisibility] = useState({});

  const { admin } = useAdmin();

  useEffect(() => {
    socket.on("orders_update", (updatedOrders) => {
      // console.log("Orders updated:", updatedOrders);
      setOrders(updatedOrders);
    });

    return () => {
      socket.off("orders_update");
    };
  }, []);
  const toggleOtpVisibility = (orderId) => {
    setOtpVisibility((prev) => ({
      ...prev,
      [orderId]: !prev[orderId], // Toggle only for the specific order
    }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("Empty"));

        if (!user || !user.token) {
          toast.error("You need to log in first!");
          return;
        }
        const response = await fetch("http://localhost:5001/api/admin/orders", {
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
        console.log(data)
      } catch (error) {
        console.error("Failed to fetch orders:", error.message);
      }
    };

    fetchOrders();
  }, []);

  const markOrderAsDone = (orderId, status) => {
    setSelectedStatus(status);
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const AcceptOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("Empty"));

      if (!user || !user.token) {
        toast.error("You need to log in first!");
        return;
      }
      const response = await fetch(`http://localhost:5001/api/admin/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Services started");
      } else {
        toast.error(data.message || "Some error occurred in admin controller");
      }
    } catch (error) {
      console.error("Service error:", error);
      toast.error("Network error. Try again later.");
    }
  };

  const RejectOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("Empty"));

      if (!user || !user.token) {
        toast.error("You need to log in first!");
        return;
      }
      const response = await fetch(`http://localhost:5001/api/admin/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // <-- Add this
        },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Services stopped");
      } else {
        toast.error(data.message || "Some error occurred in admin controller");
      }
    } catch (error) {
      console.error("Service error:", error);
      toast.error("Network error. Try again later.");
    }
  };

  const handleConfirm = async () => {
    // console.log("Updating order:", selectedOrderId, "to", selectedStatus);
    try {
      await admin(selectedOrderId, selectedStatus);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
              <th className="border p-2">OTP</th>
              <th className="border p-2">File Name</th>
              <th className="border p-2">File Path</th>
              <th className="border p-2">Copies</th>
              <th className="border p-2">Print Type</th>
              <th className="border p-2">Color Option</th>
              <th className="border p-2">Total Pages</th>
              <th className="border p-2">estimated time</th>
              <th className="border p-2">required before</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Departments</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .sort((a, b) => {
                // Prioritize pending orders
                if (a.status === "Pending" && b.status !== "Pending") return -1;
                if (a.status !== "Pending" && b.status === "Pending") return 1;
            
                // Sort by requiredBefore time in HH:MM format
                const timeA = a.requiredBefore.split(":").map(Number);
                const timeB = b.requiredBefore.split(":").map(Number);
                return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]); // Convert HH:MM to minutes and compare
              })
              .map((order) => (
                <tr
                  key={order._id}
                  className={
                    order.status === "Completed" ? "bg-green-400" : "bg-red-400"
                  }
                >
                  <td className="border p-2">{order.user.username}</td>
                  <td className="border p-2">
                    <span className="text-lg font-semibold">
                      {otpVisibility[order._id] ? order.otp : "••••••"}
                    </span>
                    <button
                      onClick={() => toggleOtpVisibility(order._id)}
                      className="p-2 bg-white rounded-full shadow"
                    >
                      {otpVisibility[order._id] ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </td>
                  <td className="border p-2">{order.fileName}</td>
                  <td className="border p-2">
                    <a
                      href={`http://localhost:5001/${order.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </td>
                  <td className="border p-2">{order.copyNumber}</td>
                  <td className="border p-2">{order.printType}</td>
                  <td className="border p-2">{order.colorOption}</td>
                  <td className="border p-2">{order.totalNoOfPages}</td>
                  <td className="border p-2">{order.estimatedTime}</td>
                  <td className="border p-2">{order.requiredBefore}</td>
                  <td className="border p-2">{order.status}</td>
                  <td className="border p-2">
                    {JSON.stringify(order.departments)}
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

      <ConfirmModal
        isOpen={isModalOpen}
        message={`Mark this order as ${selectedStatus}?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminDashboard;
