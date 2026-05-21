const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());

const uploadPath = "uploads";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

app.use("/uploads", express.static(uploadPath));

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }

});

const upload = multer({ storage });

app.get("/", (req, res) => {
    res.send("Backend server is running");
});

app.post("/upload", upload.single("image"), (req, res) => {

    console.log(req.file);

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    res.json({
        message: "Image uploaded successfully",
        image: req.file.filename
    });

});

app.get("/images", (req, res) => {

    fs.readdir(uploadPath, (err, files) => {

        if (err) {
            return res.status(500).json({
                error: "Unable to fetch images"
            });
        }

        res.json(files);

    });

});

app.delete("/delete/:name", (req, res) => {

    const imageName = req.params.name;

    const imagePath = path.join(uploadPath, imageName);

    fs.unlink(imagePath, (err) => {

        if (err) {

            return res.status(500).json({
                error: "Failed to delete image"
            });

        }

        res.json({
            message: "Image deleted successfully"
        });

    });

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});