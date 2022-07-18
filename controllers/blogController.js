const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const User = require("../models/User");
const cloudinary = require("cloudinary");
const fs = require("fs")

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET,
  secure: true
});

// getAllBlogs
exports.getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find().populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!blogs) {
    return res.status(404).json({success: false, message: "No Blogs Found" });
  }
  return res.status(200).json({success: true, message: "Blogs found successfully", blogs });
};

// addBlog
exports.addBlog = async (req, res) => {
  const { title, description, category,comments, user } = req.body;

  if (!title || !description || !category || !user || !req.files.image) {
    return res.status(422).json({success: false, message: "Plz fill All fields properly" });
  }

  let existingUser;
  try {
    existingUser = await User.findById(user);
  if (!existingUser) {
    return res.status(400).json({success: false, message: "Unable TO FInd User By This ID" });
  }

  const blogimage = req.files.image.tempFilePath;
  const myCloud = await cloudinary.v2.uploader.upload(blogimage, {
    folder: "blogs"
  });
  fs.rmSync("./tmp", { recursive: true });

  const blog = new Blog({
    title,
    description,
    category,
    comments,
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    user,
  });
    await blog.save();
    existingUser.blogs.push(blog);
    await existingUser.save();
    return res.status(200).json({success: true, message: "Blog added successfully", blog });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }

 
};

// updateBlog
exports.updateBlog = async (req, res) => {
  const { title, description, category, comments, user} = req.body;
  const blogId = req.params.id;

  let blog = await Blog.findById(blogId);
  try {
    // let blog;
    if(!blog){
      return res.status(404).json({success: false, message: "No Blog Found" });
    }

    const blogimage = req.files.image.tempFilePath;

    if(blogimage){
      await cloudinary.v2.uploader.destroy(blog.image.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(blogimage, {
        folder: "blogs"
      });
      fs.rmSync("./tmp", { recursive: true });
    }

    blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
      category,
      comments,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      user
    }, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(500).json({success: false, message: "Unable To Update The Blog" });
  }
  return res.status(200).json({success: true, message: "Blog updated successfully", blog });
};

//getBlogById
exports.getById = async (req, res) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(id).populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(404).json({success: false, message: "No Blog Found" });
  }
  return res.status(200).json({success: true, message: "Blog found successfully", blog });
};

// deleteBlog
exports.deleteBlog = async (req, res) => {
  const id = req.params.id;

  let blog;
  try {
    blog = await Blog.findByIdAndRemove(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    console.log(err);
  }
  if (!blog) {
    return res.status(500).json({success: false, message: "Unable To Delete" });
  }
  return res.status(200).json({success: true, message: "Successfully Delete" });
};

// getUserBlogs
exports.getByUserId = async (req, res) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (err) {
    return console.log(err);
  }
  if (!userBlogs) {
    return res.status(404).json({success: false, message: "No Blog Found" });
  }
  return res.status(200).json({ success: true, message: "Get user's blog sucessfully ", user: userBlogs });
};

// addCommentOnBlogByUser
exports.addCommentOnBlogByUser = async (req, res) => {
  const blogId = req.params.id;
  let blog;
  try {
    const {commentText, userID , userName} = req.body;
    if(!commentText || !commentText || !userName){
      return res.status(422).json({success: false, msg:"please fill all fields properly"});
    }
    blog = await Blog.findById(blogId).populate("user");
    if(!blog){
      return res.status(404).json({success: false, msg:"blog not found"});
    }
    const commentItem = {
      textData: commentText,
      userId: userID,
      userName: userName,
    }
    blog.comments.push(commentItem);
    const result = await blog.save();
    return res.status(201).json({
      success: true,
      msg:"comment added successfully",
      // commentItem,
      result
  });
  } catch (err) {
    return console.log(err);
  }
};


exports.filterBlogs = async (req, res) => {
  try {
    console.log(req.query);
    if (req.query) {
      const filters = req.query;
      let blogs = await Blog.find().populate("user");

      const filteredBlogs = blogs.filter((blog) => {
        let isValid = true;
        for (key in filters) {
          console.log(key, blog[key], filters[key]);
          isValid = isValid && blog[key] == filters[key];
        }
        return isValid;
      });

      console.log(filteredBlogs);
      res.status(200).json({
        success: true,
        msg: "successfully filtered Blogs",
        data: filteredBlogs,
      });
    }
    res.json()
  } catch (err) {
    console.log(err);
  }
};