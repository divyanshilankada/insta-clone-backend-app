const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Post = require('./models/post');
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors"); 
var fs = require('fs');
var path = require('path');
const multer = require('multer');
require('dotenv').config()


const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads",express.static("uploads"))
//app.use(fileUpload());

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now());
    }
});
//   const maxSize=50*1024;
var upload = multer({ storage: storage });


app.get("/post", async (req,res) => {
    
    try{
        const data = await Post.find();
        
        res.status(200).json({
            status:"Success",
            message:data
        });



    }
    catch(e){

        res.status(400).json({
            status:"Failed",
            message:e.message
        });
    }
});

app.post("/post",upload.single('PostImage'), async (req, res) => {

    try{
        
        console.log(req.file.fi);
        // const file = req.files.PostImage;

        // file.mv("./Images/" + file.name, (err) => {
        //     if (err) {
        //         res.send(JSON.stringify(err));
        //     } 
        //     else {
        //         console.log("Image Uploaded Sucessfully");
        //     }
        // });


        const data = await Post.create({
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            likes: req.body.likes,
            //PostImage: req.files.PostImage.name
            PostImage:{
                data: fs.readFileSync('uploads/' + req.file.filename),
                contentType: 'image/png'
            }
        });

        console.log(data);

        res.status(200).json({
            status: "Sucess",
            message: data
        });

    } 
    catch(e){

        res.status(400).json({
            status:"Failed",
            message:e.message
        });
    }
});

app.get("/Images/:name", async (req, res) => {
    try {
      res.sendFile(__dirname + `/Images/${req.params.name}`);
    } catch (err) {
      res.status(500).json({
        status: "Failed",
        message: err.message,
      });
    }
  });


mongoose.connect(
    "mongodb+srv://lankadadivyanshi:password321@cluster1.9bovumu.mongodb.net/?retryWrites=true&w=majority",
    (err) => {
      if (err) console.log(err);
      else console.log("Database Connected");
    }
  );

  app.listen(PORT, () => {
    console.log(`localhost:${PORT}`);
  });