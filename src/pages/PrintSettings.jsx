import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

const PrintSettings = () => {
  const { order, updateOrder } = useOrder();
  const navigate = useNavigate();

  const handleNext = () => {
    // Validation: Ensure all required fields are filled before navigation
    if (!order.copyNumber || !order.printType || !order.colorOption || !order.noOfPagesToPrint) {
      alert("Please complete all print settings before proceeding.");
      return;
    }
    navigate("/cart"); // ✅ Navigate only when button is clicked
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Print Settings<span className="text-blue-500"> Company Name</span>
        </h1>

        <div>
          <label className="label p-2">
            <span className="text-base label-text">No. of Copies</span>
          </label>
          <div className="flex justify-between items-center">
            <button className="btn btn-neutral m-4" onClick={() => updateOrder({ copyNumber: Math.max(1, order.copyNumber - 1) })}>-</button>
            {order.copyNumber}
            <button className="btn btn-neutral m-4" onClick={() => updateOrder({ copyNumber: order.copyNumber + 1 })}>+</button>
          </div>
        </div>

        <div>
          <label className="label">
            <span className="text-base label-text">Print Type</span>
          </label>
          <select className="w-full input input-bordered h-10" value={order.printType} onChange={(e) => updateOrder({ printType: e.target.value })}>
            <option value="">Select Print Type</option> {/* Prevents empty values */}
            <option>Single side</option>
            <option>Double side</option>
          </select>
        </div>

        <div>
          <label className="label">
            <span className="text-base label-text">Color Option</span>
          </label>
          <select className="w-full input input-bordered h-10" value={order.colorOption} onChange={(e) => updateOrder({ colorOption: e.target.value })}>
            <option value="">Select Color Option</option> {/* Prevents empty values */}
            <option>Black & White</option>
            <option>Color</option>
          </select>
        </div>

        <div>
          <label className="label">
            <span className="text-base label-text">Enter your description of printing your uploaded PDFs</span>
          </label>
          <input
            type="text"
            className="w-full input input-bordered h-10"
            value={order.noOfPagesToPrint}
            onChange={(e) => updateOrder({ noOfPagesToPrint: e.target.value })}
            placeholder="E.g., Page 1-5, All pages, Specific page numbers"
          />
        </div>

        {/* ✅ Fixed Navigation Issue */}
        <button className="btn btn-block btn-sm mt-2" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PrintSettings;
