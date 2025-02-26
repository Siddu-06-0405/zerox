import React from "react";
import { ShoppingCart, User } from "lucide-react";

const YourCart = () => {
  // Sample user selections
  const orderDetails = {
    pdfCount: 3,
    recordPaperCount: 2,
    frontPaperCount: 1,
    graphCount: 4,
  };

  // Pricing details
  const offlineCharge =
    5 * orderDetails.pdfCount +
    10 * orderDetails.recordPaperCount +
    15 * orderDetails.frontPaperCount +
    8 * orderDetails.graphCount;
  const serviceCharge = offlineCharge * 0.2; // 20% service charge
  const totalAmount = offlineCharge + serviceCharge;

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
          <div className="mb-2">PDFs: {orderDetails.pdfCount}</div>
          <div className="mb-2">Record Papers: {orderDetails.recordPaperCount}</div>
          <div className="mb-2">Front Papers: {orderDetails.frontPaperCount}</div>
          <div className="mb-4">Graphs: {orderDetails.graphCount}</div>

          {/* Pricing Section */}
          <div className="mb-2">Offline Charges: ₹{offlineCharge}</div>
          <div className="mb-2">Service Charge: ₹{serviceCharge.toFixed(2)}</div>
          <div className="font-bold text-lg mb-4">Total: ₹{totalAmount.toFixed(2)}</div>

          {/* Pay Button */}
          <button className="btn btn-primary w-full">Proceed to Pay</button>
        </div>
      </div>
    </div>
  );
};

export default YourCart;
