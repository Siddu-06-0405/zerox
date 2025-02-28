import { useNavigate } from "react-router-dom";
import { ShoppingCart, User, Plus, Minus } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useOrder } from "../context/OrderContext"; // ✅ Use unified order context
import { Link } from "react-router-dom";

export default function PrintOptions() {
  const { order, updateOrder } = useOrder(); // ✅ Get order & updateOrder from global context
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    updateOrder({ files: uploadedFiles });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <User size={24} />
        <h1 className="text-xl font-semibold">Zerox</h1>
        <ShoppingCart size={24} />
      </div>

      {/* Order Options Section */}
      <div className="card bg-base-100 shadow-xl p-4">
        <div className="card-body flex flex-col gap-4">
          {/* Print PDF */}
          <div className="flex items-center gap-4">
            <span className="text-lg">Print PDF</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="btn btn-outline">
              Add PDF
            </label>
          </div>

          {/* Record Papers */}
          <div className="flex items-center gap-4">
            <span className="text-lg">Record Papers</span>
            <button
              className="btn btn-circle btn-outline"
              onClick={() =>
                updateOrder({
                  recordPapers: Math.max(0, order.recordPapers - 1),
                })
              }
            >
              <Minus size={16} />
            </button>
            <span className="text-lg font-semibold">
              {order.recordPapers}
            </span>
            <button
              className="btn btn-circle btn-outline"
              onClick={() =>
                updateOrder({
                  recordPapers: order.recordPapers + 1,
                })
              }
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Front Papers for Records */}
          <div className="flex items-center gap-4">
            <span className="text-lg">Front Papers for Records</span>
            <button
              className={`btn ${
                order.frontPapers ? "btn-success" : "btn-primary"
              }`}
              onClick={() =>
                updateOrder({ frontPapers: !order.frontPapers })
              }
            >
              {order.frontPapers ? "Selected" : "Select"}
            </button>
          </div>

          {/* Graphs */}
          <div className="flex items-center gap-4">
            <span className="text-lg">Graphs</span>
            <button
              className={`btn ${
                order.graphs ? "btn-success" : "btn-primary"
              }`}
              onClick={() =>
                updateOrder({ graphs: !order.graphs })
              }
            >
              {order.graphs ? "Selected" : "Select"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between mt-4">
        <button className="btn btn-success">Add Order</button>
        <Link to="/cart">
          <button className="btn btn-warning">Go to Cart</button>
        </Link>
      </div>
      <LogoutButton />
    </div>
  );
}
