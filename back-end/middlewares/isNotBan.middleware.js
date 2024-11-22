module.exports = async (req, res, next) => {

    const isNotBan = !req.user.isBan;
  
    if (isNotBan) return next();
  
    return res
      .status(403)
      .json({ message: 'You are banned !' });
  };
