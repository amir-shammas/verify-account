import React, { useState , useContext } from "react";
import * as Yup from 'yup';
import swal from "sweetalert";
import AuthContext from "../../../context/authContext";

import { Icon } from 'react-icons-kit';
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';

import "./UserPanelChangePassword.css";


const validationSchemaForChangeUserPassword = Yup.object().shape({
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
    .max(10, "کلمه عبور حداکثر باید 10 کاراکتر باشد")
    .matches(/[a-z]/, "کلمه عبور حداقل باید شامل یک حرف کوچک باشد")
    .matches(/[A-Z]/, "کلمه عبور حداقل باید شامل یک حرف بزرگ باشد")
    .matches(/[0-9]/, "کلمه عبور حداقل باید شامل یک عدد باشد")
    .matches(/[^a-zA-Z0-9]/, "کلمه عبور حداقل باید شامل یک کاراکتر خاص باشد"),
  currentPassword: Yup
    .string()
    .transform(value => value.trim())
    .required("کلمه عبور فعلی الزامی است"),
});


function UserPanelChangePassword() {

  const authContext = useContext(AuthContext);

  const [passwordInputType, setPasswordInputType] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState(eyeOff);
  const [currentPasswordInputType, setCurrentPasswordInputType] = useState("password");
  const [currentPasswordIcon, setCurrentPasswordIcon] = useState(eyeOff);
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState("password");
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState(eyeOff);
  
  const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  
  const [editedUserCurrentPassword, setEditedUserCurrentPassword] = useState("");
  const [editedUserPassword, setEditedUserPassword] = useState("");
  const [editedUserConfirmPassword, setEditedUserConfirmPassword] = useState("");

  const [errorsForCurrentPassword, setErrorsForCurrentPassword] = useState({});
  const [errorsForChangeUserPassword, setErrorsForChangeUserPassword] = useState({});
  const [errorsForChangeUserConfirmPassword, setErrorsForChangeUserConfirmPassword] = useState({});

  const passwordInputHandler = () => {
    if(passwordInputType === "password"){
      setPasswordInputType("text");
      setPasswordIcon(eye);
    }else{
      setPasswordInputType("password");
      setPasswordIcon(eyeOff);
    }
  }

  const currentPasswordInputHandler = () => {
    if(currentPasswordInputType === "password"){
      setCurrentPasswordInputType("text");
      setCurrentPasswordIcon(eye);
    }else{
      setCurrentPasswordInputType("password");
      setCurrentPasswordIcon(eyeOff);
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

  const validateInputsForChangeUserPassword = async () => {
    try {
      await validationSchemaForChangeUserPassword.validate({
        currentPassword: editedUserCurrentPassword,
        password: editedUserPassword,
        confirmPassword: editedUserConfirmPassword,
      });
      setErrorsForCurrentPassword({}); // Clear errors if validation passes
      setErrorsForChangeUserPassword({}); // Clear errors if validation passes
      setErrorsForChangeUserConfirmPassword({}); // Clear errors if validation passes
      return true; // Validation passed
    } catch (err) {
      setErrorsForCurrentPassword({
        currentPassword: err.path === 'currentPassword' ? err.message : undefined,
      });
      setErrorsForChangeUserPassword({
        password: err.path === 'password' ? err.message : undefined,
      });
      setErrorsForChangeUserConfirmPassword({
        confirmPassword: err.path === 'confirmPassword' ? err.message : undefined,
      });
      return false; // Validation failed
    }
  }

  const changeUserPasswordHandler = async (e) => {

    try{

      e.preventDefault();

      if(authContext.userInfos.isBan){
        swal({
          title: "دسترسی شما محدود شده است",
          icon: "error",
          buttons: "متوجه شدم",
        });
        return;
      }

      const isValidInputsForChangeUserPassword = await validateInputsForChangeUserPassword();
      if (!isValidInputsForChangeUserPassword) {
        return; // Stop the submission if validation fails
      }

      const editedUser = {
        currentPassword: editedUserCurrentPassword,
        password: editedUserPassword,
        confirmPassword: editedUserConfirmPassword,
      };

      fetch("http://localhost:4000/users/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loggedInUser.token}`,
        },
        body: JSON.stringify(editedUser)
      })
        .then((res) => {
          if(res.status===452){
            swal({
              title: "رمز عبور فعلی نادرست است",
              icon: "error",
              buttons: "متوجه شدم",
            });
            throw new Error('current password is not correct !');
          }
          else{
            return res.json()
            .then(() => {
                swal({
                  title: "تغییر رمز عبور کاربر با موفقیت انجام شد",
                  icon: "success",
                  buttons: "باشه",
                });
              })
            .then(() => {
              setEditedUserCurrentPassword("");
              setEditedUserPassword("");
              setEditedUserConfirmPassword("");
            })
          }
        })

    }catch(error){
      swal({
        title: "خطایی در تغییر رمز عبور کاربر رخ داده است",
        icon: "error",
        buttons: "تلاش دوباره",
      });
    }

  }


  return (
    <div className="edit">
      <form className="edit__form" action="#">
        <div className="edit__personal">
          <div className="row">

            <div className="col-12 ">
              <label className="edit__label">رمز عبور فعلی *</label>
              <div className="user-panel__password">
                <input
                  className="edit__input"
                  // type="text"
                  type={currentPasswordInputType}
                  value={editedUserCurrentPassword}
                  onChange={(e) => setEditedUserCurrentPassword(e.target.value)}
                />
                <span className="user-panel__password-icon" onClick={currentPasswordInputHandler} ><Icon icon={currentPasswordIcon} size={25} /></span>
              </div>
              {errorsForCurrentPassword.currentPassword && <span className="error-message">{errorsForCurrentPassword.currentPassword}</span>}
            </div>

            <div className="col-12">
              <label className="edit__label">رمز عبور جدید *</label>
              <div className="user-panel__password">
                <input
                  className="edit__input"
                  // type="text"
                  type={passwordInputType}
                  value={editedUserPassword}
                  onChange={(e) => setEditedUserPassword(e.target.value)}
                />
                <span className="user-panel__password-icon" onClick={passwordInputHandler} ><Icon icon={passwordIcon} size={25} /></span>
            </div>
              {errorsForChangeUserPassword.password && <span className="error-message">{errorsForChangeUserPassword.password}</span>}
            </div>

            <div className="col-12">
              <label className="edit__label">تکرار رمز عبور جدید *</label>
              <div className="user-panel__password">
                <input
                  className="edit__input"
                  // type="text"
                  type={confirmPasswordInputType}
                  value={editedUserConfirmPassword}
                  onChange={(e) => setEditedUserConfirmPassword(e.target.value)}
                />
                <span className="user-panel__password-icon" onClick={confirmPasswordInputHandler} ><Icon icon={confirmPasswordIcon} size={25} /></span>
              </div>
              {errorsForChangeUserConfirmPassword.confirmPassword && <span className="error-message">{errorsForChangeUserConfirmPassword.confirmPassword}</span>}
            </div>

          </div>
        </div>

        <button className="edit__btn" type="submit" onClick={changeUserPasswordHandler}>
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );

}

export default UserPanelChangePassword;
