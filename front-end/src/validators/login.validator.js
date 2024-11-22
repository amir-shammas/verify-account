import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .transform(value => value.trim())
    .email("ایمیل وارد شده معتبر نمی‌باشد")
    .required("ایمیل الزامی است"),
  password: Yup.string()
    .transform(value => value.trim())
    .required("کلمه عبور الزامی است")
});

export default loginSchema;
