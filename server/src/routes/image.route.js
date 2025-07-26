import { Router } from "express";
import {uploadImage} from "../controllers/image.controller.js"
import { auth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const imageRouter = Router();

imageRouter.post("/upload",auth,upload.single("image"),uploadImage)

export default imageRouter;