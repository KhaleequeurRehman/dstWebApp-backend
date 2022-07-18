const express = require("express");
const {
  addBlog,
  deleteBlog,
  getAllBlogs,
  getById,
  getByUserId,
  updateBlog,
  filterBlogs,
  addCommentOnBlogByUser
} = require("../controllers/blogController") ;

const blogRouter = express.Router();

blogRouter.get("/blogs", getAllBlogs);

blogRouter.route("/blogs/search").get(filterBlogs);
// blogRouter.post("/add", addBlog);
blogRouter.post("/blogs", addBlog);
// blogRouter.get("/:id", getById);
blogRouter.get("/blogs/:id", getById);
// blogRouter.put("/update/:id", updateBlog);
blogRouter.put("/blogs/:id", updateBlog);
// blogRouter.delete("/:id", deleteBlog);
blogRouter.delete("/blogs/:id", deleteBlog);
// blogRouter.get("/user/:id", getByUserId);
blogRouter.get("/blogs/users/:id", getByUserId);

blogRouter.post("/blogs/:id/comment", addCommentOnBlogByUser);

module.exports = blogRouter;
