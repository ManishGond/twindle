import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth";
import { uploadVideo } from "../controller/videoController";

const videoRouter = express.Router();
const upload = multer(); // Handles multipart form-data

videoRouter.post("/upload", authenticate, upload.single("video"), uploadVideo);

export default videoRouter;
