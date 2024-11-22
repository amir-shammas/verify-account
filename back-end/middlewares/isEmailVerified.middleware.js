module.exports = async (req, res, next) => {

    const isEmailVerified = req.user.isEmailVerified;
  
    if (isEmailVerified) return next();
  
    return res
      .status(403)
      .json({ message: 'Your email is not verified !' });
  };
