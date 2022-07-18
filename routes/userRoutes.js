const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getAllUsers,
  getUserDetail,
  updateUser,
  deleteUser,
  updatePassword,
  verifyEmail
} = require("../controllers/userController");

const { isAuthenticatedUser } = require("../middleware/auth");

const Router = express.Router();

Router.route("/register").post(registerUser);

Router.route("/login").post(loginUser);

Router.route("/logout").get(logout);

Router.route("/users").get(getAllUsers);
Router.route("/users/:id").get(getUserDetail);
Router.route("/users/:id").put(updateUser);
Router.route("/users/:id").delete(deleteUser);
Router.route("/password/update/:id").put(updatePassword);

Router.route("/user/verify/:id/:token").get(verifyEmail);

module.exports = Router;
