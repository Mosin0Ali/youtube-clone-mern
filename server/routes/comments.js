import express from "express";
import {} from '../controllers/user.js';
import { verifyToken } from "../verifytoken.js";

import { addComment, deleteComment, getComments } from "../controllers/comment.js";

const router= express.Router();

router.post("/",verifyToken,addComment);
router.get("/:videoId",getComments);
router.post("/:id",verifyToken,deleteComment);

export default router;