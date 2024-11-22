const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("./../models/user.model");
const { sendEmail } = require("../utils/mailer");


exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    await userModel.registerValidation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const userExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (userExists) {
      return res.status(409).json({
        message: "username or email is duplicated.",
      });
    }

    const countOfRegisteredUsers = await userModel.countDocuments();

    // const hashedPassword = await bcrypt.hash(password, 12);
    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await userModel.create({
      name,
      username,
      email,
      password: hashedPassword,
      role: countOfRegisteredUsers > 0 ? "USER" : "ADMIN",
      // role: "USER",
      isBan: false,
      isEmailVerified: false
    });

    const userObject = user.toObject();

    Reflect.deleteProperty(userObject, "password");

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3 days",
      // expiresIn: "60 seconds",
    });

    sendEmail(
      email,
      username,
      "خوش آمدید",
      "ثبت نام شما با موفقیت انجام شد !",
    );

    return res.status(201).json({ message: "New user registered successfully !", user: userObject, accessToken });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    await userModel.loginValidation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json("There is no user with this email or username");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "password is not correct" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3 days",
      // expiresIn: "60 seconds",
    });

    return res.json({ accessToken });
    
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    return res.json({ ...req.user });
  } catch (error) {
    next(error);
  }
};


exports.forgetPassword = async (req, res, next) => {
  try {

    // console.log("forget password");
    // return res.json("forget password api");

    const { email } = req.body;

    await userModel.forgetPasswordValidation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(453).json("There is no user with this email !");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5 minutes",
    });

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    sendEmail(
      user.email,
      user.username,
      "بازیابی رمز عبور",
      `
        برای بازیابی رمز عبور روی لینک زیر کلیک کنید
        <br>
        <a href="${resetLink}">لینک بازیابی رمز عبور</a>
      `
    );

    return res.status(200).json({ message: "Reset link mailed successfully !" });
    // return res.status(200).json({ message: "Reset link mailed successfully !" , token: token });

  } catch (error) {
    next(error);
  }
}


exports.resetPassword = async (req, res, next) => {
  try {

    // console.log("reset password");
    // return res.json("reset password api");

    const { password, confirmPassword } = req.body;

    await userModel.resetPasswordValidation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const token = req.params.token;

    if (!token) {
      return res.status(401).json({
        message: "Token is required !",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({
        message: "Token is not verified !",
      });
    }

    const user = await userModel.findOne({ _id: decodedToken.id });

    if (!user) {
      return res.status(404).json("user not found !");
    }

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "password reset successfully !" });

  } catch (error) {
    next(error);
  }
}
