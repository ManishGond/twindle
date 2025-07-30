import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth";
import { uploadVideo } from "../controller/videoController";
import { fetchVideos } from "../controller/fetchVideos";

const videoRouter = express.Router();
const upload = multer({ dest: "uploads/" }); // saves to temp folder

videoRouter.get("/", fetchVideos);

// ✅ Accepts both "video" and "thumbnail" fields from form-data
videoRouter.post("/upload", authenticate, upload.any(), uploadVideo);

export default videoRouter;
