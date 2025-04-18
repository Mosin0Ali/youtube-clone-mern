import express from "express";
import { verifyToken } from "../verifytoken.js";
import { addVideo, addView, deleteVideo, getVideo, random, subscribed, trending, updateVideo,getByTag, search } from "../controllers/video.js";

const router = express.Router();

router.post("/",verifyToken,addVideo);
router.put("/:id",verifyToken,updateVideo);
router.delete("/:id",verifyToken,deleteVideo);
router.get("/find/:id",getVideo);
router.put("/view/:id",addView);
router.get("/trending",trending);
router.get("/random",random);
router.get("/subscribed",verifyToken,subscribed);
router.get("/tags",getByTag);
router.get("/search",search);

export default router;