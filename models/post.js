const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostShema = new Schema({
    name: String,
    location: String,
    likes: Number,
    description: String,
    PostImage:{
        data:Buffer,
       contentType:String
    },
    date: { type: Date, default: Date.now }

});

const Post = mongoose.model("Post", PostShema);

module.exports = Post;