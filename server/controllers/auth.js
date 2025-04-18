import User from '../models/User.js'
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"


export const signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();
        res.status(200).send("User created successfully !");
    } catch (err) {
        next(err);
    }
}

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name });
        if (!user) return next(createError(404, "User not found !"));
        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrect) return next(createError(400, "Wrong credentials !"));
        dotenv.config();
        const token = jwt.sign({
            id: user._id
        }, process.env.AUTH_SECRET);
        const { password, ...userdetails } = user._doc;
        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(userdetails);
    } catch (err) {
        next(err);
    }
}

export const googleSignin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            dotenv.config();
            const token = jwt.sign({
                id: user._id
            }, process.env.AUTH_SECRET);
            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(user._doc);
        } else {
            const newUser = new User({ ...req.body, fromGoogle: true });
            const savedUser = await newUser.save();
            dotenv.config();
            const token = jwt.sign({
                id: savedUser._id
            }, process.env.AUTH_SECRET);
            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(savedUser);
        }
    } catch (err) {
        next(err);
    }
}