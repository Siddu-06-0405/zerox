import React from "react";
import { ShoppingCart, User } from "lucide-react";
import { useOrder } from "../context/OrderContext";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000";

const YourCart = () => {
  const { order } = useOrder();

  if (!order) return <p>Loading order details...</p>;

  // Calculate Pricing
  const offlineCharge =
    5 * order.pdfCount +
    10 * order.recordPaperCount +
    15 * order.frontPaperCount +
    8 * order.graphCount;
  const serviceCharge = offlineCharge * 0.2;
  const totalAmount = offlineCharge + serviceCharge;

  // Send Order to Backend
  const handleSubmitOrder = async () => {
    const user = JSON.parse(localStorage.getItem("print-user")); // Get user info
  
    if (!user || !user.token) {
        toast.error("You need to log in first!");
        return;
    }

    try {
        console.log("Sending request with token:", user.token); // Debugging

        const response = await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`, // ✅ Ensure proper format
            },
            body: JSON.stringify(order),
        });

        const data = await response.json();
        if (response.ok) {
            toast.success("Order placed successfully!");
        } else {
            toast.error(data.message || "Failed to place order.");
        }
    } catch (error) {
        toast.error("Network error. Try again later.");
    }
};

  

  return (
    <div className="flex flex-col items-center p-4">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center w-full max-w-md mb-4">
        <User className="w-6 h-6 cursor-pointer" />
        <h1 className="text-xl font-bold">ZEROX</h1>
        <ShoppingCart className="w-6 h-6 cursor-pointer" />
      </div>

      {/* Cart Details */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-4">
        <div className="card-body">
          <h2 className="card-title text-lg font-bold">Your Cart</h2>
          <div className="mb-2">PDFs: {order.pdfCount}</div>
          <div className="mb-2">Record Papers: {order.recordPapers}</div>
          <div className="mb-2">Front Papers: {order.frontPaperCount}</div>
          <div className="mb-4">Graphs: {order.graphCount}</div>

          {/* Pricing Section */}
          <div className="mb-2">Offline Charges: ₹{offlineCharge}</div>
          <div className="mb-2">Service Charge: ₹{serviceCharge.toFixed(2)}</div>
          <div className="font-bold text-lg mb-4">Total: ₹{totalAmount.toFixed(2)}</div>

          {/* Pay Button */}
          <button className="btn btn-primary w-full" onClick={handleSubmitOrder}>
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default YourCart;
