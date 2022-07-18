const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  category:{
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // comments:[
  //   {
  //     type: mongoose.Types.ObjectId,
  //     ref: "Comment",
  //   }
  // ] ,
  comments:[
    {
      textData: {
        type: String,
        required: true,
      },
      userId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      userName:{
        type: String,
        required: true,
      }
    }
  ] ,
});

module.exports =  mongoose.model("Blog", blogSchema);
