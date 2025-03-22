import express from "express";
import { changeEmail, changePassword, login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/change-password",changePassword);

router.put("/change-email",changeEmail);

export default router;