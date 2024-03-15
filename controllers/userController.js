const jwt = require("jsonwebtoken");

const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.handleLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const usernamelowered = await email.toLowerCase();
  try {
    const user = await User.findOne({
      $or: [{ email: usernamelowered }, { username: usernamelowered }],
    });
    if (!user) {
      const error = new Error("کاربری یافت نشد");
      error.statusCode = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (isEqual) {
      const token = jwt.sign(
        {
          user: {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
          },
        },
        process.env.JWT_SECRET
      );

      res.status(201).json({
        token,
        userId: user._id.toString(),
        userEmail: user.email,
        name: user.name,
        type: "tourist",
        profilePhoto: user.profilePhoto,
        description: user.description,
        rate: user.rate,
        phoneNumber: user.phoneNumber,
      });
    } else {
      const error = new Error("کلمه عبوریارمز اشتباهه");
      error.statusCode = 422;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    await User.userValidation(req.body);
    const { name, email, password, type, city, username } = req.body;
    let isAccept = "accept";
    const usernamelowered = await username.toLowerCase();
    const emaillowered = await email.toLowerCase();
    const user = await User.findOne({ email: emaillowered });

    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(usernamelowered)) {
      const error = new Error(" نام کاربری نامعتبراست");
      error.statusCode = 408;
      throw error;
    }
    usernam = await User.findOne({ username: usernamelowered });

    if (user) {
      const error = new Error("چنین  ایمیلی موجود است");
      error.statusCode = 406;
      throw error;
    }
    if (usernam) {
      const error = new Error("چنین نام کاربری موجود است");
      error.statusCode = 406;
      throw error;
    }
    await User.create({
      name,
      email: emaillowered,
      password,
      type,
      isAccept,
      city,
      username: usernamelowered,
    });
    res.status(201).json({ message: "عضوشد" });
  } catch (err) {
    next(err);
  }
};
