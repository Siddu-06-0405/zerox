import Order from "../models/order.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single("file");

export const createOrder = async (req, res) => {
  try {
    console.log("Uploaded file:", req.file);
    console.log("Request body:", req.body);
    console.log("User making request:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!req.body.order) {
      return res.status(400).json({ message: "Order data is missing" });
    }

    const orderData = JSON.parse(req.body.order);
    console.log(orderData);

    if (!orderData.totalAmount || !orderData.totalNoOfPages ||
        !orderData.colorOption || !orderData.printType || !orderData.copyNumber) {
      return res.status(400).json({ message: "Missing required fields in order data" });
    }

    const filePath = `uploads/${req.file.filename}`;
    const fileName = req.file.originalname; // Storing relative path;

    const newOrder = new Order({
      user: req.user._id,
      filePath,
      fileName,
      ...orderData,
    });
    
    const savedOrder = await newOrder.save();
    console.log("Order saved:", savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserOngoingOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId, status: { $ne: "Completed" } })
      .select("createdAt estimatedTime status")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching ongoing orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPendingOrdersTime = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: "Pending" });

    const totalEstimatedTime = pendingOrders.reduce((sum, order) => {
      return sum + order.estimatedTime;
    }, 0);

    res.json({ totalEstimatedTime });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};