import multer from "multer";
import path from "path";
import fs from "fs";

const ensureFolderExists = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "uploads/";
        if (file.mimetype.startsWith("video/")) folder += "videos/";
        else if (file.mimetype.startsWith("image/")) folder += "images/";
        else folder += "others/";

        ensureFolderExists(folder);
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "_" + uniqueSuffix + ext);
    }
});

const upload = multer({ storage }).single("file");

export const uploadFile = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(200).json({
                message: "No file uploaded. Text data received.",
                fields: req.body
            });
        }
        return res.status(200).json({
            message: "File uploaded successfully",
            file: {
                filename: req.file.filename,
                path: req.file.path,
            },
            fields: req.body
        });
    });
};

