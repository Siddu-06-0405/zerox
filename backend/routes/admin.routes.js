import express from "express";
import { getOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { protectAdmin } from "../middleware/protectAdmin.js"; 

const router = express.Router();

// ✅ Get All Orders (Admin Only)
router.get("/orders", protectAdmin, getOrders);

// ✅ Update Order Status
router.put("/orders/:orderId", protectAdmin, updateOrderStatus);

export default router;
