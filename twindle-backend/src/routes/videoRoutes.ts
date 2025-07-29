import express from "express";
import multer from "multer";
import { uploadVideo } from "../controller/videoController";

const videoRoutes = express.Router()

const storage = multer.memoryStorage()
const upload = multer({storage})

videoRoutes.post("/upload", upload.single("video"), uploadVideo);

export default videoRoutes;