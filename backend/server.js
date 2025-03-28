import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";
import http from "http";
import Order from "./models/order.model.js";
import User from "./models/user.model.js";
import Razorpay from "razorpay";

import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = process.env.NODE_ENV !== "production";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: isDev ? "http://localhost:5173" : process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 🔐 WebSocket authentication (Fixing Admin/User token validation)
io.use(async (socket, next) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    let token = cookies.jwt; // Default token from cookies

    if (!token && socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    }

    if (!token) return next(new Error("Unauthorized - No token provided"));

    let decoded;
    try {
      if (socket.handshake.auth.role === "admin") {
        // Admin token verification
        decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
        socket.role = "admin";
        socket.user = { username : 'SSSADMIN' }
      } else {
        // User token verification
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.role = "user";
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return next(new Error("Unauthorized - User/Admin not found"));

        // console.log(user)
        socket.user = user;
      }
    } catch (error) {
      return next(new Error("Unauthorized - Invalid token"));
    }
    next();
  } catch (error) {
    console.error("❌ Socket authentication error:", error);
    next(new Error("Unauthorized - " + error.message));
  }
});

// 📡 Function to send live order updates
const sendOrderUpdate = async () => {
  const orders = await Order.find().populate("user", "username");
  io.emit("orders_update", orders);
};

// 🎯 MongoDB Change Stream to detect order updates
const changeStream = Order.watch([{ $match: { operationType: "insert" } }]);
changeStream.on("change", async () => {
  // console.log("📢 New order detected in the database!");
  sendOrderUpdate();
});

// 🟢 WebSocket connection handling
io.on("connection", (socket) => {
  // console.log(`🔌 New connection: ${socket.user.username} (Role: ${socket.role})`);

  if (socket.role === "admin") {
    socket.join("admins");
    // console.log("✅ Admin joined room: admins");
    sendOrderUpdate();
  }
  const sendOrderCount = async () => {
    const count = await Order.countDocuments({ status: "Pending" });
    socket.emit("orderCountUpdate", count);
  };

  sendOrderCount();

  // Listen for changes in the Order collection
  const changeStream = Order.watch();
changeStream.on("change", async (change) => {
  // console.log("📢 Order collection changed:", change); // Debugging log
  sendOrderCount(); // Ensure this is called
});


  socket.on("admin:updateOrder", async ({ orderId, status }) => {
    await Order.findByIdAndUpdate(orderId, { status });
    sendOrderUpdate();
  });

  socket.on("disconnect", () => {
    // console.log(`❌ Disconnected: ${socket.user.username}`);
  });
});

// 🛠️ Express Middleware & Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: isDev ? "http://localhost:5173" : process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/api/getkey",(req,res)=>{
  res.status(200).json({
    key: process.env.RAZORPAY_API_KEY
  })
});

// 🗂️ File Upload Setup
const uploadPath = path.join(__dirname, "uploads/");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

// 📂 Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/files", express.static(path.join(__dirname, "files")));

if (!isDev) {
  app.use(express.static(path.join(__dirname, "/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// 🚀 Start the server
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`🔥 Server running on port ${PORT} in ${isDev ? "development" : "production"} mode`);
});
