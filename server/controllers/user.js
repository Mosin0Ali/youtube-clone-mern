import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const updateUser = async (req, res, next) => {
    try {
        if (req.params.id === req.user.id) {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });
            res.status(200).json(updatedUser)
        } else {
            return next(createError(403, "Unauthorized user !"));
        }
    } catch (err) {
        return next(createError(500, "Server error !"));
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        if (req.params.id === req.user.id) {
            const updatedUser = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted !")
        } else {
            return next(createError(403, "Unauthorized user !"))
        }
    } catch (err) {
        return next(createError(500, "Server error !"));
    }
}
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).lean();;
        if (!user) {
            return res.status(404).json({ message: "User not found !" });
        }
        const { password, ...userDetails } = user;
        res.status(200).json(userDetails);
    } catch (err) {
        next(err);
    }

}
export const subscribe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.subscribedUsers.includes(req.params.id)) {
            return res.status(400).json("You are already subscribed to this user.");
        }
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id }
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }
        });
        res.status(200).json("Subscribed sucessfully !");
    } catch (err) {
        next(err);
    }
}
export const unsubscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.id }
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 }
        });
        res.status(200).json("Unsubscribed sucessfully !");
    } catch (err) {
        next(err);
    }
}
export const like = async (req, res, next) => {
    try {
        const id = req.user.id;

        const videoId = req.params.videoId;
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        });
        res.status(200).json("Video Liked !");
    } catch (err) {
        next(err);
    }
}
export const dislike = async (req, res, next) => {
    try {
        const id = req.user.id;
        const videoId = req.params.videoId;
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        });
        res.status(200).json("Video Disliked !");
    } catch (err) {
        next(err);
    }
}