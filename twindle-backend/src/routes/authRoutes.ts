import express from "express";
import { registerUser, loginUser } from "../controller/authController";
import { upload } from "../middleware/upload";

const authRoutes = express.Router();

authRoutes.post("/register", upload.single("avatar"), registerUser);
authRoutes.post("/login", loginUser);

export default authRoutes;
