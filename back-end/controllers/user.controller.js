const bcrypt = require("bcrypt");
const userModel = require("./../models/user.model");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/mailer");


// ////////////////////////////////////////////  USER - CONTROLLERS  ///////////////////////////////////////////


exports.updateUser = async (req, res, next) => {

  try{

    const { name, username, email } = req.body;

    const id = String(req.user._id);

    await userModel.updateValidation({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const userExists = await userModel.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: id }
    });

    if (userExists) {
      return res.status(409).json({
        message: "username or email is duplicated.",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        username,
        email,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user updated successfully !", data: user});

  }catch(error){
    next(error);
  }

};


exports.changeUserPassword = async (req, res, next) => {

  try{

    const { currentPassword, password, confirmPassword } = req.body;
    
    const id = String(req.user._id);

    const currentUser = await userModel.findById(id);

    if (!currentUser) {
      return res.status(401).json("There is no user with this id !");
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, String(currentUser.password));

    if (!isCurrentPasswordCorrect) {
      return res.status(452).json({ message: "current password is not correct !" });
    }

    await userModel.changePasswordValidation_ByUser({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "password changed successfully !", data: user});

  }catch(error){
    next(error);
  }
};


exports.sendLinkForVerifyEmail = async (req, res, next) => {

  try{

    const token = jwt.sign({ id: String(req.user._id) }, process.env.JWT_SECRET, {
      expiresIn: "5 minutes",
    });

    const verifyEmailLink = `http://localhost:3000/verify-email/${token}`;

    sendEmail(
      String(req.user.email),
      String(req.user.username),
      "تایید ایمیل",
      `
        برای تایید ایمیل روی لینک زیر کلیک کنید
        <br>
        <a href="${verifyEmailLink}">لینک تایید ایمیل</a>
      `
    );

    // return res.status(200).json({ message: "Reset link mailed successfully !" });
    return res.status(200).json({ message: "verifyEmail link mailed successfully !" , token: token });

    // await userModel.updateValidation({...req.body , id}).catch((err) => {
    //   err.statusCode = 400;
    //   throw err;
    // });

  }catch(error){
    next(error);
  }

};


exports.verifyEmail = async (req, res, next) => {

  try{

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

    user.isEmailVerified = true;

    await user.save();

    res.status(200).json({ message: "email verified successfully !" });

  }catch(error){
    next(error);
  }

}


// ////////////////////////////////////////////  ADMIN - CONTROLLERS  ///////////////////////////////////////////


exports.getAllUsersByAdmin = async (req, res, next) => {
  try{

    const page = Number(req.query.page) || 1;

    const {itemsPerPage , sortType , filterType , searchField , searchPhrase} = req.body;

    const selectedFilterType = 
      filterType === "role-admin" ? {role: "ADMIN"} :
      filterType === "role-user" ? {role: "USER"} :
      filterType === "isBan" ? {isBan: true} :
      filterType === "notIsBan" ? {isBan: false} :
      {};

    const selectedSearchField = 
      searchField === "name" && searchPhrase ? { name: { $regex: searchPhrase , $options: "i" } } :
      searchField === "username" && searchPhrase ? { username: { $regex: searchPhrase , $options: "i" } } :
      searchField === "email" && searchPhrase ? { email: { $regex: searchPhrase , $options: "i" } } :
      searchField === "all" && searchPhrase ? {
          $or: [
              { name: { $regex: searchPhrase ? searchPhrase : "", $options: "i" } },
              { username: { $regex: searchPhrase ? searchPhrase : "", $options: "i" } },
              { email: { $regex: searchPhrase ? searchPhrase : "", $options: "i" } }
          ]
        } :
      {};

    const numberOfItems = await userModel
      .find(selectedSearchField)
      .find(selectedFilterType)
      .countDocuments();

    const selectedSortType = 
      sortType === "name-asc" ? {name: 1} :
      sortType === "name-desc" ? {name: -1} :
      sortType === "username-asc" ? {username: 1} :
      sortType === "username-desc" ? {username: -1} :
      sortType === "email-asc" ? {email: 1} :
      sortType === "email-desc" ? {email: -1} :
      sortType === "createdAt-asc" ? {createdAt: 1} :
      sortType === "createdAt-desc" ? {createdAt: -1} :
      sortType === "updatedAt-asc" ? {updatedAt: 1} :
      sortType === "updatedAt-desc" ? {updatedAt: -1} : 
      {};

    const users = await userModel
      .find(selectedSearchField)
      .find(selectedFilterType)
      .sort(selectedSortType)
      .skip((page-1)*itemsPerPage)
      .limit(itemsPerPage);

    const pagination = {
      itemsPerPage: itemsPerPage,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: itemsPerPage * page < numberOfItems,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfItems / itemsPerPage),
    };
    
    if (!users) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "users get successfully !", data: users, pagination: pagination, selectedSortType: sortType, selectedFilterType: filterType, selectedSearchField: searchField, searchPhrase: searchPhrase});
    
  }catch(error){
    next(error);
  }
};


exports.updateUserByAdmin = async (req, res, next) => {

  try{

    const { name, username, email } = req.body;

    const { id } = req.params;

    await userModel.updateValidation({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const userExists = await userModel.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: id }
    });

    if (userExists) {
      return res.status(409).json({
        message: "username or email is duplicated.",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        username,
        email,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user updated successfully !", data: user});

  }catch(error){
    next(error);
  }

};


exports.createUserByAdmin = async (req, res, next) => {

  try {

    const { name , username, email, password, confirmPassword } = req.body;

    await userModel.registerValidation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const isUserExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExists) {
      return res.status(409).json({
        message: "username or email is duplicated.",
      });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await userModel.create({
      name,
      username,
      email,
      password: hashedPassword,
      role: "USER",
      isBan: false,
      isEmailVerified: false,
    });

    if (!user) {
      return res.status(404).json("user not found !");
    }

    const userObject = user.toObject();

    Reflect.deleteProperty(userObject, "password");

    return res.status(201).json({status: 201, message: "user Created successfully !", data: userObject});

  } catch (error) {
    next(error);
  }
};


exports.changeUserRoleByAdmin = async (req, res, next) => {

  try{

    const { role } = req.body;

    const { id } = req.params;

    await userModel.changeRoleValidation({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        role,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "role changed successfully !", data: user});

  }catch(error){
    next(error);
  }
}


exports.changeUserPasswordByAdmin = async (req, res, next) => {

  try{

    const { password, confirmPassword } = req.body;

    const { id } = req.params;

    await userModel.changePasswordValidation({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "password changed successfully !", data: user});

  }catch(error){
    next(error);
  }
}


exports.removeUserByAdmin = async (req, res, next) => {

  try{

    const { id } = req.params;

    await userModel.removeValidation({id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findByIdAndDelete(
      id,
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user deleted successfully !", data: user});

  }catch(error){
    next(error);
  }

};


exports.banUserByAdmin = async (req, res, next) => {

  try{

    const { id } = req.params;

    await userModel.banValidation({id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        isBan: true,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user banned successfully !", data: user});

  }catch(error){
    next(error);
  }

};


exports.unbanUserByAdmin = async (req, res, next) => {

  try{

    const { id } = req.params;

    await userModel.unbanValidation({id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        isBan: false,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user unbanned successfully !", data: user});

  }catch(error){
    next(error);
  }

};


exports.verifyUserEmailByAdmin = async (req, res, next) => {

  try{

    const { id } = req.params;

    await userModel.verifyEmailValidation({id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        isEmailVerified: true,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user email verified successfully !", data: user});

  }catch(error){
    next(error);
  }

};


exports.unverifyUserEmailByAdmin = async (req, res, next) => {

  try{

    const { id } = req.params;

    await userModel.unverifyEmailValidation({id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        isEmailVerified: false,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user email unverified successfully !", data: user});

  }catch(error){
    next(error);
  }

};
