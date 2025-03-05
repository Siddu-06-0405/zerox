import React from "react";
import { ShoppingCart, User } from "lucide-react";
import { useOrder } from "../context/OrderContext";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5001";

const YourCart = () => {
  const { order } = useOrder();
  const { departments } = order;

  if (!order) return <p>Loading order details...</p>;

  // Calculate Pricing
  const offlineCharge = 5 * order.pdfCount;
  const serviceCharge = offlineCharge * 0.2;
  const totalAmount = offlineCharge + serviceCharge;

  // Send Order to Backend
  const handleSubmitOrder = async () => {
    const user = JSON.parse(localStorage.getItem("print-user")); // Get user info
  
    if (!user || !user.token) {
      toast.error("You need to log in first!");
      return;
    }
  
    if (!order.files || order.files.length === 0) {
      toast.error("No files selected. Please upload your PDFs first.");
      return;
    }
  
    const formData = new FormData();
    
    // Append files to formData
    order.files.forEach((file) => formData.append("files", file));
  
    // ✅ Send order as a properly formatted JSON string
    const orderData = {
      copyNumber: order.copyNumber,
      pdfCount: order.pdfCount,
      recordPapers: order.recordPapers,
      noOfPagesToPrint: order.noOfPagesToPrint,
      printType: order.printType,
      colorOption: order.colorOption,
      departments: order.departments,
      totalAmount: totalAmount.toFixed(2),
    };
  
    console.log("Sending order data:", orderData); // Debugging
    formData.append("order", JSON.stringify(orderData));
  
    try {
      console.log("Sending request with token:", user.token); // Debugging
  
      const response = await fetch(`${API_URL}/api/orders/place-order`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success("Order placed successfully!");
      } else {
        toast.error(data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
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
          <div className="mb-2">Number of Pages to print: {order.noOfPagesToPrint}</div>
          <div className="mb-2">Print Type: {order.printType}</div>
          <div className="mb-2">Color Options: {order.colorOption}</div>
          <div className="card-body flex flex-col gap-4">
            <h2 className="mb-2">Selected Departments Front Papers:</h2>
            {Object.entries(departments).map(([dept, count]) =>
              count > 0 ? (
                <div key={dept} className="flex justify-between">
                  <span>{dept}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ) : null
            )}
          </div>

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