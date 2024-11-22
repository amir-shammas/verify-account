import React , { useState } from "react";
import Navbar from "./../../../Components/User/Navbar/Navbar";
import Topbar from "./../../../Components/User/Topbar/Topbar";
import swal from "sweetalert";
import * as Yup from 'yup';

import "./ForgetPassword.css";


const validationSchemaForForgetPassword = Yup.object().shape({
  email: Yup
    .string()
    .transform(value => value.trim())
    .email("ایمیل وارد شده معتبر نمی‌باشد")
    .required("ایمیل الزامی است"),
});


function ForgetPassword() {

  //   return <div>ForgetPassword</div>;

  const [email, setEmail] = useState("");

  const [errorsForEmail, setErrorsForEmail] = useState({});

  const validateInputsForForgetPassword = async () => {
    try {
      await validationSchemaForForgetPassword.validate({
        email: email,
      });
      setErrorsForEmail({}); // Clear errors if validation passes
      return true; // Validation passed
    } catch (err) {
      setErrorsForEmail({
        email: err.path === 'email' ? err.message : undefined,
      });
      return false; // Validation failed
    }
  }

  const forgetPasswordHandler = async (e) => {
    try{

      e.preventDefault();

      const isValidInputsForForgetPassword = await validateInputsForForgetPassword();

      if (!isValidInputsForForgetPassword) {
        return; // Stop the submission if validation fails
      }

      const user = {
        email: email,
      };

      fetch("http://localhost:4000/auth/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
      })

      .then((res) => {
        if(res.status===453){
          swal({
            title: "کاربر یافت نشد !",
            icon: "error",
            buttons: "متوجه شدم",
          });
          throw new Error('user not found !');
        }
        else{
          return res.json()
          .then(() => {
            swal({
              title: "لینک بازیابی رمز عبور به ایمیل شما ارسال شد",
              icon: "success",
              buttons: "باشه",
            });
          })
          .then(() => {
            setEmail("");
          })
        }
      })

    }catch(error){
      swal({
        title: "خطایی در ارسال لینک بازیابی رخ داده است",
        icon: "error",
        buttons: "تلاش دوباره",
      });
    }
  }


  return (
    <>
      <Topbar />
      <Navbar />

      <section className="login-register">
        <div className="login">
          <span className="login__title">فراموشی رمز عبور</span>
          <div className="login__new-member">
            <span className="login__new-member-text">لطفا ایمیلی که با آن ثبت نام نموده اید را وارد نمایید</span>
          </div>

          <form className="login-form" onSubmit={forgetPasswordHandler}>

            <div className="login-form__password">
              <input
                type="text"
                name="email"
                placeholder="ایمیل"
                className="login-form__username-input green-border"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="login-form__username-icon fa fa-envelope"></i>
            </div>

            <div className="error-message">
              {errorsForEmail.email && <span className="error-message">{errorsForEmail.email}</span>}
            </div>

            <button
              type="submit"
              className="login-form__btn login-form__btn-success"
            >
              <i className="login-form__btn-icon fa fa-lock"></i>
              <span className="login-form__btn-text">ارسال لینک بازیابی رمز عبور</span>
            </button>

          </form>
          
        </div>
      </section>

    </>
  );

}

export default ForgetPassword;
