import express from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { deleteAFile, getAFile, getRoomFiles, uploadFile } from "../controller/file.controller.js";

const router = express.Router();

router.route('/upload/:roomId').post(verifyJwt, upload.single('file'), uploadFile);

router.route('/get-file/:fileId').get(getAFile);

router.route('/get-files/:roomId').get(getRoomFiles);

router.route('/delete/:fileId').delete(deleteAFile);

export default router;