const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("email-validator");
const sendEmail = require("../utils/utils");
const Token = require("../models/token");
const crypto = require("crypto");

// Register User
exports.registerUser = async (req, res) => {
  // console.log(req.body);
  const { firstName, lastName, userName, email, password} = req.body;
  console.log(firstName, lastName, userName, email, password);
  if (!firstName || !lastName || !userName || !email || !password) {
    return res.status(422).json({ error: "Plz fill the field properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email Already Exist" });
    }else {
      const user = new User({ firstName, lastName, userName, email, password});
      const userRegistered = await user.save();

      let token = await new Token({
        userId: userRegistered._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const message = `${process.env.BASE_URL}/user/verify/${userRegistered._id}/${token.token}`;
      await sendEmail(userRegistered.email, "Verify Email", message);
  

      if (userRegistered) {
        res.status(201).json({
          // message: "user registered sucessfully",
          success: true,
          message: "An Email sent to your account please verify",
        });
      } else {
        res.status(500).json({ error: "Failed to registered" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

//verify email
exports.verifyEmail = async (req, res) => {

  // res.status(200).json({message:"verifyEmail route working fine", param_id: req.params.id, token: req.params.token})
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).json({message:"Invalid link"});

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).json({message:"Invalid link"});

    await User.updateOne({ _id: user._id, verified: true });
    await Token.findByIdAndRemove(token._id);

    // res.json({message:"email verified sucessfully"});
    res.status(200).redirect("http://localhost:3000/user/verify")
    // res.writeHead(200,"http://localhost:3000/user/verify")
    res.end()
  } catch (error) {
    res.status(400).json({message:"An error occured"});
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { emailOrUser, password } = req.body;

    if (!emailOrUser || !password) {
      return res.status(400).json({ error: "Plz Filled the data" });
    }

    var isEmail = validator.validate(emailOrUser);

    const userLogin = !isEmail ? await User.findOne({ userName:emailOrUser }).select("+password"):
    await User.findOne({ email: emailOrUser }).select("+password");
    // console.log(userLogin);

    if(userLogin.verified === false){
      return res.status(400).json({sucess: false, message: "Your account is not verified first verify your account" });
    }
    // , we have sent email to your given email
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      // console.log(token);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials pass" });
      } else {
        res.cookie("token", token, {
          expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
        });
        res.status(200).json({
          success: true,
          message: "user Signin successfully",
          token,
          user: userLogin,
        });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
};

// Logout User
exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out sucessfully",
  });
};

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.status(200).json({
      success: true,
      users,
    });
    if(!users){
      res.status(400).json({
        success: false,
        message: "Failed to get users"
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// get User detail
exports.getUserDetail = async (req, res) => {
  // console.log(req.params.id);

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found", success: false });
    }

    res
      .status(200)
      .json({ message: "User found successfully", success: true, user });
  } catch (err) {
    console.log(err);
  }
};

// update user
exports.updateUser = async (req, res) => {
  // console.log(req.params.id);
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "user not available of this id", success: false });
    }

    // user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    user = await User.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email
    }, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "user updated successfully",
      success: true,
      updatedUser: user,
    });
  } catch (err) {
    console.log(err);
  }
};

// update User password
exports.updatePassword = async (req, res) => {

  const user = await User.findById(req.params.id).select("+password");

  const isPasswordMatched = await bcrypt.compare(req.body.oldPassword, user.password);
  
  if (!isPasswordMatched) {
    return res
    .status(400)
    .json({ message: "Old password is incorrect", success: false });
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return res
    .status(400)
    .json({ message: "password does not match", success: false });
  }

  user.password = req.body.newPassword;
  await user.save();
  res.status(200).json({ message: "password updated sucessfully", success: true });
}

// delete user
exports.deleteUser = async (req, res) => {
  // console.log(req.params.id);
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found", success: false });
    }

    await user.remove();
    res
      .status(200)
      .json({ message: "user deleted successfully", success: true });
  } catch (err) {
    console.log(err);
  }
}