import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = process.env.NODE_ENV !== "production";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: isDev ? "http://localhost:5173" : process.env.CLIENT_URL,
    credentials: true,
  })
);

const uploadPath = path.join(__dirname, "uploads/");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use("/files", express.static(path.join(__dirname, "files")));
app.use("/C:/Users/csidd/OneDrive/Desktop/zerox/backend/uploads/", express.static(path.join(__dirname, "uploads")));

if (!isDev) {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT} in ${isDev ? "development" : "production"} mode`);
});
