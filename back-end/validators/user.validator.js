const yup = require("yup");


const updateValidator = yup.object().shape({
  id: yup
    .string()
    .required("شناسه کاربر الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست"),
  name: yup
    .string()
    .required("نام و نام خانوادگی الزامی می‌باشد")
    .min(3, "نام و نام خانوادگی نباید کمتر از 3 کاراکتر باشد")
    .max(10, "نام و نام خانوادگی نباید بیشتر از 10 کاراکتر باشد"),
  username: yup
    .string()
    .required("نام کاربری الزامی می‌باشد"),
  email: yup
    .string()
    .email("آدرس ایمیل نامعتبر است")
    .required("آدرس ایمیل الزامی می‌باشد"),
});


const changeRoleValidator = yup.object().shape({
  id: yup
    .string()
    .required("شناسه کاربر الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست"),
  role: yup
    .string()
    .required("نقش کاربر الزامی است")
    .oneOf(["ADMIN", "USER"], "نقش کاربر باید یکی از مقادیر ADMIN و USER باشد"),
});


const changePasswordValidator = yup.object().shape({
  id: yup
    .string()
    .required("شناسه کاربر الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست"),
  password: yup
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .required("رمز عبور الزامی می‌باشد"),
  confirmPassword: yup
    .string()
    .required("تکرار کلمه عبور الزامی می باشد")
    .oneOf([yup.ref("password"), null], "کلمه ی عبور و تکرار آن یکسان نیستند"),
});


const changePasswordValidator_ByUser = yup.object().shape({
  id: yup
    .string()
    .required("شناسه کاربر الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست"),
  currentPassword: yup
    .string()
    .required("رمز عبور فعلی الزامی می‌باشد"),
  password: yup
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .required("رمز عبور الزامی می‌باشد"),
  confirmPassword: yup
    .string()
    .required("تکرار کلمه عبور الزامی می باشد")
    .oneOf([yup.ref("password"), null], "کلمه ی عبور و تکرار آن یکسان نیستند"),
});


const removeValidator = yup.object().shape({
  id: yup
    .string()
    .required("شناسه کاربر الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست"),
});


const banValidator = yup.object().shape({
  id: yup
    .string()
    .required("شناسه کاربر الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست"),
});


const unbanValidator = yup.object().shape({
  id: yup
    .string()
    .required("شناسه کاربر الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست"),
});


const verifyEmailValidator = yup.object().shape({
  id: yup
    .string()
    .required("شناسه کاربر الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست"),
});


const unverifyEmailValidator = yup.object().shape({
  id: yup
    .string()
    .required("شناسه کاربر الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست"),
});


module.exports = {
  updateValidator,
  changePasswordValidator,
  changePasswordValidator_ByUser,
  changeRoleValidator,
  removeValidator,
  banValidator,
  unbanValidator,
  verifyEmailValidator,
  unverifyEmailValidator,
};
