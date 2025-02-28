import Order from "../models/order.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Storage setup for saving files to VPS
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("uploads/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).array("files", 5); // Accepts up to 5 files
export const createOrder = async (req, res) => {
  try {
      console.log("Request body:", req.body);
      console.log("User making request:", req.user);

      if (!req.user) {
          return res.status(401).json({ message: "Unauthorized - User not found" });
      }

      const newOrder = new Order({
          user: req.user._id, // Ensure this is correct
          ...req.body,
      });

      const savedOrder = await newOrder.save();
      console.log("Order saved:", savedOrder);

      res.status(201).json(savedOrder);
  } catch (error) {
      console.error("Error in createOrder:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

// Place an Order
export const placeOrder = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }

    try {
      const { copyNumber, printType, colorOption, requiredBefore } = req.body;
      const files = req.files.map((file) => file.path);

      const order = new Order({
        user: req.user.id, // Assuming authentication middleware
        files,
        copyNumber,
        printType,
        colorOption,
        requiredBefore,
      });

      await order.save();
      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
};

// Get all Orders (For Admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "username email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update Order Status (For Admin)
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
    res.status(500).json({ error: "Server error" });
  }
};
