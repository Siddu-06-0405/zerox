import express from "express";
import { getOrders, updateOrderStatus } from "../controllers/order.controller.js";
import {protectRoute} from "../middleware/protectRoute.js"; // Ensure only admins can access

const router = express.Router();

router.get("/orders", protectRoute, getOrders);
router.put("/orders/:orderId", protectRoute, updateOrderStatus);

export default router;
