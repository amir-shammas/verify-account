import React , { useState } from "react";
import Navbar from "./../../../Components/User/Navbar/Navbar";
import Topbar from "./../../../Components/User/Topbar/Topbar";
import swal from "sweetalert";
import * as Yup from 'yup';
import { useParams , useNavigate } from "react-router-dom";

import { Icon } from 'react-icons-kit';
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';

import "./ResetPassword.css";


const validationSchemaForResetPassword = Yup.object().shape({
  confirmPassword: Yup
    .string()
    .transform(value => value.trim())
    .required("تکرار کلمه عبور الزامی است")
    .oneOf([Yup.ref('password'), null], "کلمه عبور و تکرار آن باید یکسان باشند"),
  password: Yup
    .string()
    .transform(value => value.trim())
    .required("کلمه عبور الزامی است")
    .min(8, "کلمه عبور حداقل باید 8 کاراکتر باشد")
    .max(30, "کلمه عبور حداکثر باید 30 کاراکتر باشد")
    .matches(/[a-z]/, "کلمه عبور حداقل باید شامل یک حرف کوچک باشد")
    .matches(/[A-Z]/, "کلمه عبور حداقل باید شامل یک حرف بزرگ باشد")
    .matches(/[0-9]/, "کلمه عبور حداقل باید شامل یک عدد باشد")
    .matches(/[^a-zA-Z0-9]/, "کلمه عبور حداقل باید شامل یک کاراکتر خاص باشد"),
});


function ResetPassword() {

  // return <div>ResetPassword</div>;

  const navigate = useNavigate()

  const token = useParams().token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorsForPassword, setErrorsForPassword] = useState({});
  const [errorsForConfirmPassword, setErrorsForConfirmPassword] = useState({});

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


  const validateInputsForResetPassword = async () => {
    try {
      await validationSchemaForResetPassword.validate({
        password: password,
        confirmPassword: confirmPassword,
      });
      setErrorsForPassword({}); // Clear errors if validation passes
      setErrorsForConfirmPassword({}); // Clear errors if validation passes
      return true; // Validation passed
    } catch (err) {
      setErrorsForPassword({
        password: err.path === 'password' ? err.message : undefined,
      });
      setErrorsForConfirmPassword({
        confirmPassword: err.path === 'confirmPassword' ? err.message : undefined,
      });
      return false; // Validation failed
    }
  }

  const resetPasswordHandler = async (e) => {
    try{

      e.preventDefault();

      const isValidInputsForResetPassword = await validateInputsForResetPassword();

      if (!isValidInputsForResetPassword) {
        return; // Stop the submission if validation fails
      }

      const user = {
        password: password,
        confirmPassword: confirmPassword,
      };

      fetch(`http://localhost:4000/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
      })

      .then((res) => {

        if(!res.ok){
          swal({
            title: "توکن منقضی شده است",
            icon: "error",
            buttons: "متوجه شدم",
          });
          throw new Error('token expired !');
        }else{
          return res.json()
          .then(() => {
            swal({
              title: "رمز عبور جدید ثبت شد",
              icon: "success",
              buttons: "باشه",
            });
          })
          .then(() => {
            navigate('/login')
          })
        }
      })
    }catch(error){
      swal({
        title: "خطایی در بازیابی رمز عبور رخ داده است",
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
          <span className="login__title">بازیابی رمز عبور</span>
          <div className="login__new-member">
            <span className="login__new-member-text">لطفا رمز عبور جدید را وارد نمایید</span>
          </div>

          <form className="login-form" onSubmit={resetPasswordHandler}>

          <div className="login-form__password">
              <input
                type={passwordInputType}
                value={password}
                name="password"
                placeholder="رمز عبور جدید"
                className="login-form__username-input green-border"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="login-form__password-icon" onClick={passwordInputHandler} ><Icon icon={passwordIcon} size={25} /></span>
            </div>
            <div className="error-message">
              {errorsForPassword.password && <span className="error-message">{errorsForPassword.password}</span>}
            </div>

            <div className="login-form__password">
              <input
                type={confirmPasswordInputType}
                value={confirmPassword}
                name="confirmPassword"
                placeholder="تکرار رمز عبور جدید"
                className="login-form__username-input green-border"
                id="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="login-form__password-icon" onClick={confirmPasswordInputHandler} ><Icon icon={confirmPasswordIcon} size={25} /></span>
            </div>
            <div className="error-message">
              {errorsForConfirmPassword.confirmPassword && <span className="error-message">{errorsForConfirmPassword.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              className="login-form__btn login-form__btn-success"
            >
              <i className="login-form__btn-icon fa fa-lock-open"></i>
              <span className="login-form__btn-text">ثبت رمز عبور جدید</span>
            </button>

          </form>
          
        </div>
      </section>

    </>
  );

}

export default ResetPassword;
