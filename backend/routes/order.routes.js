import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserOngoingOrders, createOrder,getPendingOrdersTime, getUserOrders, getSlots } from "../controllers/order.controller.js";
import upload from "../middleware/fileUpload.js";

const router = express.Router();

// ✅ User: Fetch their ongoing orders
router.get("/ongoing-orders", protectRoute, getUserOngoingOrders);

router.get("/pending-time",protectRoute, getPendingOrdersTime);

// ✅ User: Place an order
router.post("/place-order", protectRoute, upload.single("file"), createOrder);

router.get("/user-orders", protectRoute, getUserOrders);  
router.get("/slots", getSlots);  

export default router;
