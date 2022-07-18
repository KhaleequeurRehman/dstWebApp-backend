const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please enter a firstname"],
    },
    lastName: {
      type: String,
      required: [true, "please enter a lastname"],
    },
    userName: {
      type: String,
      required: [true, "please enter a username"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: [true, "Email already exist"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "password must be aleast 6 characters long"],
      select: false,
    },
  role: {
    type: String,
    default: "user",
  },
  verified: {
    type: Boolean,
    default: false,
  },
   blogs: [{ type: mongoose.Types.ObjectId, ref: "Blog", default: [] }],
  // blogs: [{ type: mongoose.Types.ObjectId, ref: "Blog", required: true }],
    tokens: [
      {
        token: {
          type: String,
          requried: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// we are hashing password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // console.log('I am pre password')
    this.password = await bcrypt.hash(this.password, 12);
    // this.cpassword = await bcrypt.hash(this.cpassword, 12);
    next();
  }
});

// we are generating token
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model("User", userSchema);




