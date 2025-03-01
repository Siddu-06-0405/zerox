import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import upload from "../middleware/fileUpload.js";
import { createOrder } from "../controllers/order.controller.js";

const router = express.Router();

// ✅ Create Order (User Route)
router.post("/", protectRoute, createOrder);

// ✅ Create Order with File Upload (if needed)
router.post("/place-order", protectRoute, upload.array("files"), createOrder);

export default router;
