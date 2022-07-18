const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config({ path: "config/config.env" });

//use middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
  }));
// importing routes

// user related routes
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const category = require("./routes/categroyRoutes");
const commentRoutes = require("./routes/commentRoutes");

// using routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", blogRoutes);
app.use("/api/v1", category);
app.use("/api/v1", commentRoutes);

app.get("*", (req, res) => {
  res.status(200).json({ message: "server is running" });
});

module.exports = app;
