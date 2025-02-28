import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    files: [{ type: String }], // File paths stored in VPS storage
    copyNumber: { type: Number, required: true },
    printType: { type: String, required: true, enum: ["Single side", "Double side"] },
    colorOption: { type: String, required: true, enum: ["Black & White", "Color"] },
    requiredBefore: { type: String, required: true },
    status: { type: String, default: "Pending", enum: ["Pending", "In Progress", "Completed"] },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
