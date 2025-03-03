import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import http from "http"; // For WebSockets
import { Server } from "socket.io"; // WebSockets
import multer from "multer"; // File uploads
import fs from "fs"; // File system
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = process.env.NODE_ENV !== "production";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: isDev ? "http://localhost:5173" : process.env.CLIENT_URL, credentials: true },
});

app.use(express.json());
app.use(cookieParser());

// ✅ Enable CORS
app.use(
  cors({
    origin: isDev ? "http://localhost:5173" : process.env.CLIENT_URL,
    credentials: true,
  })
);

// ✅ Ensure Uploads Directory Exists
const uploadPath = path.join(__dirname, "uploads/");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Configure Multer for File Uploads (Store in VPS)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use("/files", express.static(path.join(__dirname, "files")));

// ✅ Serve Uploaded Files
app.use("/C:/Users/siddhartha%20reddy/Desktop/newzero/zerox/backend/uploads/", express.static(path.join(__dirname, "uploads")));

// ✅ Serve Frontend in Production
if (!isDev) {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

// ✅ WebSocket for Real-Time Order Updates
io.on("connection", (socket) => {
  console.log("Admin connected to WebSocket");

  socket.on("orderUpdated", (data) => {
    console.log("Order Updated:", data); // Debugging
    io.emit("newOrderUpdate", data); // Broadcast order updates to all connected admins
  });

  socket.on("disconnect", () => {
    console.log("Admin disconnected");
  });
});

// ✅ Start Server
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT} in ${isDev ? "development" : "production"} mode`);
});
