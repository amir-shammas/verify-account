import React, { useEffect , useContext, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./../../../Components/User/Navbar/Navbar";
import Topbar from "./../../../Components/User/Topbar/Topbar";
import AuthContext from "./../../../context/authContext";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import loginSchema from "./../../../validators/login.validator";

import { Icon } from 'react-icons-kit';
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [rememberMe, setRememberMe] = useState(false);

  const [passwordInputType, setPasswordInputType] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState(eyeOff);

  const passwordInputHandler = () => {
    if(passwordInputType === "password"){
      setPasswordInputType("text");
      setPasswordIcon(eye);
    }else{
      setPasswordInputType("password");
      setPasswordIcon(eyeOff);
    }
  }

  const form = useFormik({

    initialValues: { email: "", password: ""},

    onSubmit: (values, { setSubmitting }) => {

      userLogin(values);

      setTimeout(() => {
        setSubmitting(false);
      }, 500);

    },

    validationSchema: loginSchema,

  });

  const userLogin = (values) => {
    // event.preventDefault();

    const userData = {
      identifier: values.email,
      password: values.password,
    };

    fetch(`http://localhost:4000/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
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
          title: "با موفقیت وارد شدید",
          icon: "success",
          buttons: "باشه",
        }).then(value => {
          navigate('/')
        })
        // console.log(result);
        authContext.login({}, result.accessToken, rememberMe);
        
      })
      .catch((err) => {
        swal({
          title: "ایمیل یا کلمه عبور نادرست است",
          icon: "error",
          buttons: "تلاش دوباره",
        });
      });

    // console.log(userData);
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
        <div className="login">
          <span className="login__title">ورود به حساب کاربری</span>
          <div className="login__new-member">
            <span className="login__new-member-text">کاربر جدید هستید؟</span>
            <Link className="login__new-member-link" to="/register">
              ثبت نام
            </Link>
          </div>

          <form onSubmit={form.handleSubmit} className="login-form">

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
              {/* <i className="login-form__password-icon fa fa-eye"></i> */}
              {/* <i className="login-form__password-icon fa fa-eye-slash"></i> */}
              
              <span className="login-form__password-icon" onClick={passwordInputHandler} ><Icon icon={passwordIcon} size={25} /></span>

            </div>
            <div className="error-message">
              {form.errors.password && form.touched.password && form.errors.password}
            </div>

            <button
              type="submit"
              className={form.isSubmitting || !form.isValid ? "invalid-btn login-form__btn login-form__btn-error" : "login-form__btn login-form__btn-success"}
              disabled={form.isSubmitting || !form.isValid}
            >
              <i className="login-form__btn-icon fa fa-user-plus"></i>
              <span className="login-form__btn-text">{form.isSubmitting ? "در حال ارسال ..." : "ورود"}</span>
            </button>

            <div className="login-form__password-setting">
              <label className="login-form__password-remember">
                <input
                  className="login-form__password-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="login-form__password-text">
                  مرا به خاطر داشته باش
                </span>
              </label>
              <label className="login-form__password-forget">
                <Link className="login-form__password-forget-link" to="/forget-password">
                  فراموشی رمز عبور
                </Link>
              </label>
            </div>
          </form>
          
        </div>
      </section>

    </>
  );
}
