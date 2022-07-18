const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Please Login to access this resource" });
    // throw new Error("Please Login to access this resource");
    return next();
  }

  const decodedData = jwt.verify(token, process.env.SECRET_KEY);

  req.user = await User.findById(decodedData.id);

  next();
};
