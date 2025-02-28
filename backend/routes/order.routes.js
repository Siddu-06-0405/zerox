import express from "express";
import Order from "../models/order.model.js";
import { protectRoute } from "../middleware/protectRoute.js";
import upload from "../middleware/fileUpload.js";
import { createOrder } from "../controllers/order.controller.js";

const router = express.Router();

// ✅ Create Order (Using Controller)
router.post("/", protectRoute, createOrder);

// ✅ Create Order with File Upload (if needed)
router.post("/place-order", protectRoute, upload.array("files"), createOrder);

// ✅ Get All Orders for Admin (Ensure Only Admins Can Access)
router.get("/admin", protectRoute, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied." });
    }

    const orders = await Order.find().populate("user", "fullName email");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

export default router;
