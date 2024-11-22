import React, { useEffect , useContext , useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./../../../Components/User/Navbar/Navbar";
import Topbar from "./../../../Components/User/Topbar/Topbar";
import AuthContext from "./../../../context/authContext";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import registerSchema from "./../../../validators/register.validator";

import { Icon } from 'react-icons-kit';
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';

import "./../Login/Login.css";

export default function Register() {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  // console.log(authContext);

  const [passwordInputType, setPasswordInputType] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState(eyeOff);
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState("password");
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState(eyeOff);

  const passwordInputHandler = () => {
    if(passwordInputType === "password"){
      setPasswordInputType("text");
      setPasswordIcon(eye);
    }else{
      setPasswordInputType("password");
      setPasswordIcon(eyeOff);
    }
  }

  const confirmPasswordInputHandler = () => {
    if(confirmPasswordInputType === "password"){
      setConfirmPasswordInputType("text");
      setConfirmPasswordIcon(eye);
    }else{
      setConfirmPasswordInputType("password");
      setConfirmPasswordIcon(eyeOff);
    }
  }

  const form = useFormik({

    initialValues: { name: "", username: "", email: "", password: "", confirmPassword: "" },

    onSubmit: (values, { setSubmitting }) => {

      registerNewUser(values);

      setTimeout(() => {
        setSubmitting(false);
      }, 500);

    },

    validationSchema: registerSchema,

  });

  const registerNewUser = (values) => {

    const newUserInfos = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    fetch(`http://localhost:4000/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserInfos),
    })
      .then((res) => {
        // console.log(res);
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        } else {
          return res.json();
        }
      })
      .then((result) => {
        swal({
          title: "با موفقیت ثبت نام شدید",
          icon: "success",
          buttons: "باشه",
        }).then(value => {
          navigate('/')
        })
        // console.log(result);
        // authContext.login(result.user , result.accessToken);
        const rememberMe = true;
        authContext.login({} , result.accessToken, rememberMe);
      })
      .catch((err) => {
        swal({
          title: "خطایی در ثبت نام رخ داده است",
          icon: "error",
          buttons: "تلاش دوباره",
        });
      });
  };

  useEffect(() => {
    if (authContext.isLoggedIn) {
      navigate('/');
    }
  }, [authContext.isLoggedIn, navigate]);

  return (
    <>
      <Topbar />
      <Navbar />

      <section className="login-register">
        <div className="login register-form">
          <span className="login__title">ساخت حساب کاربری</span>
          <div className="login__new-member">
            <span className="login__new-member-text">
              قبلا ثبت‌نام کرده‌اید؟
            </span>
            <Link className="login__new-member-link" to="/login">
              وارد شوید
            </Link>
          </div>

          <form onSubmit={form.handleSubmit} className="login-form">

            <div className="login-form__username">
              <input
                type="text"
                name="name"
                placeholder="نام و نام خانوادگی"
                className={form.errors.name && form.touched.name ? "login-form__username-input red-border" : "login-form__username-input green-border"}
                id="name"
                value={form.values.name}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              <i className="login-form__username-icon fa fa-user"></i>
            </div>
            <div className="error-message">
              {form.errors.name && form.touched.name && form.errors.name}
            </div>

            <div className="login-form__username">
              <input
                type="text"
                name="username"
                placeholder="نام کاربری"
                className={form.errors.username && form.touched.username ? "login-form__username-input red-border" : "login-form__username-input green-border"}
                id="username"
                value={form.values.username}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              <i className="login-form__username-icon fa fa-user"></i>
            </div>
            <div className="error-message">
              {form.errors.username && form.touched.username && form.errors.username}
            </div>

            <div className="login-form__password">
              <input
                type="text"
                name="email"
                placeholder="ایمیل"
                className={form.errors.email && form.touched.email ? "login-form__username-input red-border" : "login-form__username-input green-border"}
                id="email"
                value={form.values.email}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              <i className="login-form__username-icon fa fa-envelope"></i>
            </div>
            <div className="error-message">
              {form.errors.email && form.touched.email && form.errors.email}
            </div>

            <div className="login-form__password">
              <input
                // type="password"
                type={passwordInputType}
                name="password"
                placeholder="کلمه عبور"
                className={form.errors.password && form.touched.password ? "login-form__username-input red-border" : "login-form__username-input green-border"}
                id="password"
                value={form.values.password}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              {/* <i className="login-form__password-icon fa fa-lock-open"></i> */}
              <span className="login-form__password-icon" onClick={passwordInputHandler} ><Icon icon={passwordIcon} size={25} /></span>
            </div>
            <div className="error-message">
              {form.errors.password && form.touched.password && form.errors.password}
            </div>

            <div className="login-form__password">
              <input
                // type="password"
                type={confirmPasswordInputType}
                name="confirmPassword"
                placeholder="تکرار کلمه عبور"
                className={form.errors.confirmPassword && form.touched.confirmPassword ? "login-form__username-input red-border" : "login-form__username-input green-border"}
                id="confirmPassword"
                value={form.values.confirmPassword}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              {/* <i className="login-form__password-icon fa fa-lock-open"></i> */}
              <span className="login-form__password-icon" onClick={confirmPasswordInputHandler} ><Icon icon={confirmPasswordIcon} size={25} /></span>
            </div>
            <div className="error-message">
              {form.errors.confirmPassword && form.touched.confirmPassword && form.errors.confirmPassword}
            </div>

            <button
              type="submit"
              className={form.isSubmitting || !form.isValid ? "invalid-btn login-form__btn login-form__btn-error" : "login-form__btn login-form__btn-success"}
              disabled={form.isSubmitting || !form.isValid}
            >
              <i className="login-form__btn-icon fa fa-user-plus"></i>
              <span className="login-form__btn-text">{form.isSubmitting ? "در حال ارسال ..." : "عضویت"}</span>
            </button>

          </form>
          
        </div>
      </section>

    </>
  );
}
