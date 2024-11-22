import React, { useEffect, useState, useContext } from "react";
import * as Yup from 'yup';
import swal from "sweetalert";
import AuthContext from "../../../context/authContext";

import "./UserPanelEditAccount.css";


const validationSchemaForEditUser = Yup.object().shape({
  email: Yup
    .string()
    .transform(value => value.trim())
    .email("ایمیل وارد شده معتبر نمی‌باشد")
    .min(10, "ایمیل حداقل باید 10 کاراکتر باشد")
    .max(15, "ایمیل حداکثر باید 15 کاراکتر باشد")
    .required("ایمیل الزامی است"),
  username: Yup
    .string()
    .transform(value => value.trim())
    .min(4, "نام کاربری حداقل باید 4 کاراکتر باشد")
    .max(7, "نام کاربری حداکثر باید 7 کاراکتر باشد")
    .required("نام کاربری الزامی است"),
  name: Yup
    .string()
    .transform(value => value.trim())
    .min(3, "نام حداقل باید 3 کاراکتر باشد")
    .max(6, "نام حداکثر باید 6 کاراکتر باشد")
    .required("نام و نام خانوادگی الزامی است"),
});


function UserPanelEditAccount() {

  const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

  const authContext = useContext(AuthContext);

  const [editedUserName, setEditedUserName] = useState("");
  const [editedUserUsername, setEditedUserUsername] = useState("");
  const [editedUserEmail, setEditedUserEmail] = useState("");

  const [errorsForEditUser, setErrorsForEditUser] = useState({});

  const validateInputsForEditUser = async () => {
    try {
      await validationSchemaForEditUser.validate({
        name: editedUserName,
        username: editedUserUsername,
        email: editedUserEmail,
      });
      setErrorsForEditUser({}); // Clear errors if validation passes
      return true; // Validation passed
    } catch (err) {
      setErrorsForEditUser({
        name: err.path === 'name' ? err.message : undefined,
        username: err.path === 'username' ? err.message : undefined,
        email: err.path === 'email' ? err.message : undefined,
      });
      return false; // Validation failed
    }
  }

  const editUserHandler = async (e) => {

    e.preventDefault();

    if(authContext.userInfos.isBan){
      swal({
        title: "دسترسی شما محدود شده است",
        icon: "error",
        buttons: "متوجه شدم",
      });
      return;
    }

    const isValidInputsForEditUser = await validateInputsForEditUser();
    if (!isValidInputsForEditUser) {
      return; // Stop the submission if validation fails
    }

    const editedUser = {
      name: editedUserName,
      username: editedUserUsername,
      email: editedUserEmail,
    };

    fetch("http://localhost:4000/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loggedInUser.token}`,
      },
      body: JSON.stringify(editedUser)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update user!');
        return res.json();
      })
      .then(() => {
        // Fetch updated user information
        return fetch("http://localhost:4000/auth/me", {
          headers: {
            "Authorization": `Bearer ${loggedInUser.token}`,
          },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update user!');
        return res.json();
      })
      .then((updatedUser) => {
        // console.log(updatedUser);
        // Update the global context with new user information
        authContext.login(updatedUser, loggedInUser.token);
        swal({
          title: "ویرایش کاربر با موفقیت انجام شد",
          icon: "success",
          buttons: "باشه",
        });
      })
      .catch((err) => {
        swal({
          title: "خطایی در ویرایش کاربر رخ داده است",
          icon: "error",
          buttons: "تلاش دوباره",
        });
      });
  }

  // useEffect(() => {
  //   setEditedUserName(authContext.userInfos.name);
  //   setEditedUserUsername(authContext.userInfos.username);
  //   setEditedUserEmail(authContext.userInfos.email);
  // }, [authContext.userInfos.name , authContext.userInfos.username , authContext.userInfos.email ]);


  useEffect(() => {
    // Ensure we are safely reading from authContext.userInfos
    setEditedUserName(authContext.userInfos?.name || "");
    setEditedUserUsername(authContext.userInfos?.username || "");
    setEditedUserEmail(authContext.userInfos?.email || "");
  }, [authContext.userInfos])


  return (
    <div className="edit">
      <form className="edit__form" action="#">
        <div className="edit__personal">
          <div className="row">

            <div className="col-12">
              <label className="edit__label">نام و نام خانوادگی *</label>
              <input
                className="edit__input"
                type="text"
                value={editedUserName}
                onChange={(e) => setEditedUserName(e.target.value)}
              />
              {errorsForEditUser.name && <div className="error-message">{errorsForEditUser.name}</div>}
            </div>

            <div className="col-12">
              <label className="edit__label">نام کاربری *</label>
              <input
                className="edit__input"
                type="text"
                value={editedUserUsername}
                onChange={(e) => setEditedUserUsername(e.target.value)}
              />
              {errorsForEditUser.username && <span className="error-message">{errorsForEditUser.username}</span>}
            </div>

            <div className="col-12">
              <label className="edit__label">ایمیل *</label>
              <input
                className="edit__input"
                type="text"
                value={editedUserEmail}
                onChange={(e) => setEditedUserEmail(e.target.value)}
              />
              {errorsForEditUser.email && <span className="error-message">{errorsForEditUser.email}</span>}
            </div>

          </div>
        </div>

        <button className="edit__btn" type="submit" onClick={editUserHandler}>
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );

}

export default UserPanelEditAccount;
