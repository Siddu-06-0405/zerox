import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserOngoingOrders, createOrder } from "../controllers/order.controller.js";
import upload from "../middleware/fileUpload.js";

const router = express.Router();

// ✅ User: Fetch their ongoing orders
router.get("/ongoing-orders", protectRoute, getUserOngoingOrders);

// ✅ User: Place an order
router.post("/place-order", protectRoute, upload.single("file"), createOrder);

export default router;
