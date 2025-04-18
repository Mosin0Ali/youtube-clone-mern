import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UserRoutes from './routes/users.js';
import VideoRoutes from './routes/videos.js';
import CommentRoutes from './routes/comments.js';
import UploadRoutes from './routes/upload.js';
import AuthRoutes from './routes/auth.js';
import cookieParser from "cookie-parser";
import path from "path";
import cors from 'cors';
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
dotenv.config();
const connect = () => {
    mongoose.connect(process.env.MONGO).then(() => {
        console.log('Mongo DB Connected');
    }).catch(err => {
        throw err;
    });
}
app.use(cookieParser());
app.use(express.json());
app.use('/api/cdn/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use("/api/users", UserRoutes);
app.use("/api/video", VideoRoutes);
app.use("/api/comments", CommentRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api", UploadRoutes);


app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    });
});

app.listen(8001, () => {
    connect()
    console.log('Server running !')
});
