import Order from "../models/order.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage setup for saving files to VPS
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

const upload = multer({ storage }).array("files", 5); // Accepts up to 5 files

// ✅ Create Order (Handles JSON Parsing & File Storage)
export const createOrder = async (req, res) => {
  try {
    console.log("Uploaded files:", req.files);
    console.log("Request body:", req.body);
    console.log("User making request:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    if (!req.body.order) {
      return res.status(400).json({ message: "Order data is missing" });
    }

    // ✅ Fix: Convert `req.body.order` from JSON string to object
    const orderData = JSON.parse(req.body.order);
    console.log(orderData);

    // ✅ Ensure all required fields are present
    if (!orderData.totalAmount || !orderData.pdfCount || !orderData.noOfPagesToPrint ||
        !orderData.colorOption || !orderData.printType || !orderData.copyNumber) {
      return res.status(400).json({ message: "Missing required fields in order data" });
    }

    const newOrder = new Order({
      user: req.user._id,
      files: req.files.map((file) => file.path), // ✅ Store only file paths as strings
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

export const placeOrder = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }

    try {
      console.log("🔹 Raw request body:", req.body);
      console.log("🔹 Raw order field:", req.body.order);

      if (!req.user) {
        console.error("❌ Unauthorized - User not found");
        return res.status(401).json({ message: "Unauthorized - User not found" });
      }

      if (!req.body.order) {
        console.error("❌ Order data is missing");
        return res.status(400).json({ message: "Order data is missing" });
      }

      // ✅ Fix: Parse `order` correctly
      let orderData;
      if (typeof req.body.order === "string") {
        try {
          orderData = JSON.parse(req.body.order);
        } catch (error) {
          console.error("❌ JSON Parse Error:", error);
          return res.status(400).json({ message: "Invalid JSON format for order" });
        }
      } else {
        orderData = req.body.order;
      }

      console.log("✅ Parsed Order Data:", orderData);

      // ✅ Convert `files` array to just file paths (strings)
      const files = req.files ? req.files.map((file) => file.path) : [];


      // ✅ Convert `noOfPagesToPrint` to a valid number (or keep as string if range)
      if (!isNaN(orderData.noOfPagesToPrint)) {
        orderData.noOfPagesToPrint = Number(orderData.noOfPagesToPrint);
      }

      console.log("✅ Final Order Object:", { user: req.user._id, files, ...orderData });

      const order = new Order({
        user: req.user._id,
        files, // Now correctly formatted
        ...orderData,
      });

      await order.save();
      console.log("✅ Order saved successfully!");
      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
      console.error("❌ Error in placeOrder:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
};



// ✅ Get all Orders (For Admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "username");
    res.json(orders);
  } catch (error) {
    console.error("Error in getOrders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Order Status (For Admin)
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
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ message: "Server error" });
  }
};
