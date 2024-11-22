const jwt = require("jsonwebtoken");
const userModel = require("./../models/user.model");

module.exports = async (req, res, next) => {
  const authorizationHeader = req.header("Authorization")?.split(" ");

  if (authorizationHeader?.length !== 2) {
    return res.status(403).json({
      message: "This route is protected and is accessible only for logged-in users!",
    });
  }

  const token = authorizationHeader[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).lean();
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    Reflect.deleteProperty(user, "password");

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      error.message = "توکن منقضی شده است";
      error.statusCode = 401;
    } else if (error instanceof jwt.JsonWebTokenError) {
      error.message = "توکن نامعتبر است";
      error.statusCode = 401;
    } else {
      error.message = "Unexpected error";
      error.statusCode = 500;
    }
    next(error);
  }
};
