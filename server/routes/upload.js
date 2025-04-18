import express from "express";
import { verifyToken } from "../verifytoken.js";
import {uploadFile} from "../controllers/upload.js";

const router= express.Router();

router.post("/uploadfile",verifyToken,uploadFile);
router.post("/cdn",verifyToken);

export default router;