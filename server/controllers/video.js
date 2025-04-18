import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const addVideo = async (req, res, next) => {
    try {
        const newVideo = new Video({
            userId: req.user.id, ...req.body
        });
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
    } catch (err) {
        next(err);
    }

}
export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found !"));
        if (req.user.id === video.userId) {
            const updatedVideo = await Video.findByIdAndUpdate(eq.params.id, {
                $set: req.body
            }, { new: true });
            res.status(200).json(updatedVideo);
        } else {
            return next(createError(403, "Unauthorized !"));
        }
    } catch (err) {
        next(err);
    }

}
export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found !"));
        if (req.user.id === video.userId) {
            await Video.findByIdAndDelete(eq.params.id);
            res.status(200).json("Video deleted successfully !");
        } else {
            return next(createError(403, "Unauthorized !"));
        }
    } catch (err) {
        next(err);
    }

}
export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);
    } catch (err) {
        next(err);
    }
}


export const addView = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);
    } catch (err) {
        next(err);
    }
}
export const random = async (req, res, next) => {
    try {
        const video = await Video.aggregate([{ $sample: { size: 40 } }]);
        res.status(200).json(video);
    } catch (err) {
        next(err);
    }
}
export const trending = async (req, res, next) => {
    try {
        const video = await Video.find().sort({ view: -1 }); //-1 More Views 1 Less Viewed
        res.status(200).json(video);
    } catch (err) {
        next(err);
    }
}
export const getByTag = async (req, res, next) => {
    try {
        if (req.query.tags === 'random') {
            return random(req, res, next); 
        }
        const tags = req.query.tags.split(',');
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        if (!videos.length) {
            return next(createError(404, "No videos found !"));
        }
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
}
export const search = async (req, res, next) => {
    try {
        const query = req.query.q;
        const video = await Video.find(
            {
                title: {
                    $regex: query, $options: "i"
                }
            }
        ).limit(40);
        if (!video.length) {
            return next(createError(404, "No videos found !"));
        }
        res.status(200).json(video);
    } catch (err) {
        next(err);
    }
}
export const subscribed = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        if (!subscribedChannels) return next(createError(404, "No subscribed channels !"));
        const list = await Promise.all(
            subscribedChannels.map((channelId) => {
                return Video.find({ userId: channelId });
            })
        );
        const filtered = list.filter(videos => videos != null && videos.length > 0);
        res.status(200).json(filtered.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
        next(err);
    }
}