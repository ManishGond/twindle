import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth";
import { uploadVideo } from "../controller/videoController";
import { fetchVideos } from "../controller/fetchVideos";

const videoRouter = express.Router();
const upload = multer(); // Handles multipart form-data

videoRouter.get("/", fetchVideos)
videoRouter.post("/upload", authenticate, upload.single("video"), uploadVideo);

export default videoRouter;
