import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    files: [{ type: String }], // File paths stored in VPS storage
    copyNumber: { type: Number, required: true },
    printType: { type: String, required: true, enum: ["Single side", "Double side"] },
    colorOption: { type: String, required: true, enum: ["Black & White", "Color"] },
    noOfPagesToPrint: { type: String, required: true }, // Fixed: Should be a Number
    recordPapers: { type: Number, default: 0 }, // ✅ Added record papers field
    departments: { type: Map, of: Number, default: {} }, // ✅ Stores selected departments & their count
    pdfCount: { type: Number, required: true }, // ✅ Added to store number of PDFs
    totalAmount: { type: Number, required: true }, // ✅ Stores calculated cost
    status: { type: String, default: "Pending", enum: ["Pending", "In Progress", "Completed"] },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
