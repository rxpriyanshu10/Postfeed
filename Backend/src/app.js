const express = require("express");
const multer = require("multer");
const cors = require("cors");
const uploadFile = require("./services/storage.services");
const postModel = require("./DB/models/post.model");
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});


const upload = multer({
    storage: multer.memoryStorage()
});


app.use(express.json());

app.post("/create-post", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Image file is required. Send multipart/form-data with field name 'image'."
            });
        }

        const caption = req.body?.caption?.trim();

        if (!caption) {
            return res.status(400).json({
                message: "Caption is required. Send it as a text field named 'caption'."
            });
        }

        //console.log(req.file);

        const result = await uploadFile(
            req.file.buffer,
            req.file.originalname
        );

        const post = await postModel.create({
            image : result.url, 
            caption
        })

        res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Upload failed",
            error: error.message
        });
    }
});

app.get('/posts' , async(req, res) =>{

   const posts =  await postModel.find(); 

  return res.status(200).json({
    message: "Posts Fetched Sucessfully",
    posts
   })

})

module.exports = app;
