const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { schema } = require("./secure/userValidation");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    default: "",

  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["tourist", "tour", "admin"],
    required: true,
  },

  description: {
    type: String,
    default: "",
  },
  rate: {
    type: Number,
    default: 0,
  },
  tours: {
    type: Array,
  },
  isAccept: {
    type: String,
    default: "accept",
    enum: ["accept", "waiting", "reject"],
  },
 
  money: {
    type: Number,
    default: 0,
  },
  blockedmoney: {
    type: Number,
    default: 0,
  },
  saveds: {
    type: Array,
  },
  leaders: {
    type: Array,
  },
  cards: {
    type: Array,
  },
  city: {
    type: Number,
    default: 301,
  },
  rnumb:{
    type:Number,
    default: 0,

  }
});

userSchema.statics.userValidation = function (body) {
  return schema.validate(body, { abortEarly: false });
};

userSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", userSchema);
