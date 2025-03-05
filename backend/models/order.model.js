import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filePath: { type: String, required: true }, // Stores the file location
    fileName: { type: String, required: true }, // Stores the actual file name
    copyNumber: { type: Number, required: true },
    printType: { type: String, required: true, enum: ["Single side", "Double side"] },
    colorOption: { type: String, required: true, enum: ["Black & White", "Color"] },
    totalNoOfPages: { type: Number, required: true },
    recordPapers: { type: Number, default: 0 },
    departments: { type: Map, of: Number, default: {} },
    totalAmount: { type: Number, required: true },
    estimatedTime: { type: Number },
    status: { type: String, default: "Pending", enum: ["Pending", "In Progress", "Completed", "Cancelled"] },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
