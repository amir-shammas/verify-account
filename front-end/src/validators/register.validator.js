import * as Yup from "yup";

const registerSchema = Yup.object().shape({
  name: Yup
    .string()
    .transform(value => value.trim())
    .min(3, "نام حداقل باید 3 کاراکتر باشد")
    .max(6, "نام حداکثر باید 6 کاراکتر باشد")
    .required("نام و نام خانوادگی الزامی است"),
  username: Yup
    .string()
    .transform(value => value.trim())
    .min(4, "نام کاربری حداقل باید 4 کاراکتر باشد")
    .max(7, "نام کاربری حداکثر باید 7 کاراکتر باشد")
    .required("نام کاربری الزامی است"),
  email: Yup
    .string()
    .transform(value => value.trim())
    .email("ایمیل وارد شده معتبر نمی‌باشد")
    .min(10, "ایمیل حداقل باید 10 کاراکتر باشد")
    .max(30, "ایمیل حداکثر باید 30 کاراکتر باشد")
    .required("ایمیل الزامی است"),
  password: Yup
    .string()
    .transform(value => value.trim())
    .required("کلمه عبور الزامی است")
    .min(8, "کلمه عبور حداقل باید 8 کاراکتر باشد")
    .max(10, "کلمه عبور حداکثر باید 10 کاراکتر باشد")
    .matches(/[a-z]/, "کلمه عبور حداقل باید شامل یک حرف کوچک باشد")
    .matches(/[A-Z]/, "کلمه عبور حداقل باید شامل یک حرف بزرگ باشد")
    .matches(/[0-9]/, "کلمه عبور حداقل باید شامل یک عدد باشد")
    .matches(/[^a-zA-Z0-9]/, "کلمه عبور حداقل باید شامل یک کاراکتر خاص باشد"),
  confirmPassword: Yup
    .string()
    .transform(value => value.trim())
    .required("تکرار کلمه عبور الزامی است")
    .oneOf([Yup.ref('password'), null], "کلمه عبور و تکرار آن باید یکسان باشند")
});

export default registerSchema;
