import React, { useEffect, useState } from "react";
import AdminPanelDatatable from "./../../../Components/AdminPanel/AdminPanelDatatable/AdminPanelDatatable";
import ErrorBox from "./../../../Components/ErrorBox/ErrorBox";
import DetailsModal from "./../../../Components/Modals/DetailsModal/DetailsModal";
import EditModal from "./../../../Components/Modals/EditModal/EditModal";
import * as Yup from 'yup';
import swal from "sweetalert";

import { Icon } from 'react-icons-kit';
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';

import "./AdminPanelUsers.css"


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


const validationSchemaForCreateUser = Yup.object().shape({
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
});


function AdminPanelUsers() {

  const [passwordInputTypeForChangeUserPassword, setPasswordInputTypeForChangeUserPassword] = useState("password");
  const [passwordIconForChangeUserPassword, setPasswordIconForChangeUserPassword] = useState(eyeOff);
  const [confirmPasswordInputTypeForChangeUserPassword, setConfirmPasswordInputTypeForChangeUserPassword] = useState("password");
  const [confirmPasswordIconForChangeUserPassword, setConfirmPasswordIconForChangeUserPassword] = useState(eyeOff);

  const [passwordInputTypeForCreateUser, setPasswordInputTypeForCreateUser] = useState("password");
  const [passwordIconForCreateUser, setPasswordIconForCreateUser] = useState(eyeOff);
  const [confirmPasswordInputTypeForCreateUser, setConfirmPasswordInputTypeForCreateUser] = useState("password");
  const [confirmPasswordIconForCreateUser, setConfirmPasswordIconForCreateUser] = useState(eyeOff);

  const [isVisibleDetailsModal , setIsVisibleDetailsModal] = useState(false);
  const [isVisibleEditModal , setIsVisibleEditModal] = useState(false);
  const [isVisibleCreateModal , setIsVisibleCreateModal] = useState(false);
  const [isVisibleChangeUserRoleModal , setIsVisibleChangeUserRoleModal] = useState(false);
  const [isVisibleChangeUserPasswordModal , setIsVisibleChangeUserPasswordModal] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [sortType, setSortType] = useState("");

  const [filterType, setFilterType] = useState("");

  const [searchField, setSearchField] = useState("");

  const [searchPhrase, setSearchPhrase] = useState("");

  const [editedUserName, setEditedUserName] = useState(selectedUser.name);
  const [editedUserUsername, setEditedUserUsername] = useState(selectedUser.username);
  const [editedUserEmail, setEditedUserEmail] = useState(selectedUser.email);

  const [createdUserName, setCreatedUserName] = useState("");
  const [createdUserUsername, setCreatedUserUsername] = useState("");
  const [createdUserEmail, setCreatedUserEmail] = useState("");
  const [createdUserPassword, setCreatedUserPassword] = useState("");
  const [createdUserConfirmPassword, setCreatedUserConfirmPassword] = useState("");

  const [editedUserRole, setEditedUserRole] = useState(selectedUser.role);

  const [editedUserPassword, setEditedUserPassword] = useState("");
  const [editedUserConfirmPassword, setEditedUserConfirmPassword] = useState("");

  const [errorsForEditUser, setErrorsForEditUser] = useState({});
  const [errorsForCreateUser, setErrorsForCreateUser] = useState({});
  const [errorsForChangeUserPassword, setErrorsForChangeUserPassword] = useState({});
  const [errorsForChangeUserConfirmPassword, setErrorsForChangeUserConfirmPassword] = useState({});


  const passwordInputHandlerForChangeUserPassword = () => {
    if(passwordInputTypeForChangeUserPassword === "password"){
      setPasswordInputTypeForChangeUserPassword("text");
      setPasswordIconForChangeUserPassword(eye);
    }else{
      setPasswordInputTypeForChangeUserPassword("password");
      setPasswordIconForChangeUserPassword(eyeOff);
    }
  }


  const confirmPasswordInputHandlerForChangeUserPassword = () => {
    if(confirmPasswordInputTypeForChangeUserPassword === "password"){
      setConfirmPasswordInputTypeForChangeUserPassword("text");
      setConfirmPasswordIconForChangeUserPassword(eye);
    }else{
      setConfirmPasswordInputTypeForChangeUserPassword("password");
      setConfirmPasswordIconForChangeUserPassword(eyeOff);
    }
  }


  const passwordInputHandlerForCreateUser = () => {
    if(passwordInputTypeForCreateUser === "password"){
      setPasswordInputTypeForCreateUser("text");
      setPasswordIconForCreateUser(eye);
    }else{
      setPasswordInputTypeForCreateUser("password");
      setPasswordIconForCreateUser(eyeOff);
    }
  }


  const confirmPasswordInputHandlerForCreateUser = () => {
    if(confirmPasswordInputTypeForCreateUser === "password"){
      setConfirmPasswordInputTypeForCreateUser("text");
      setConfirmPasswordIconForCreateUser(eye);
    }else{
      setConfirmPasswordInputTypeForCreateUser("password");
      setConfirmPasswordIconForCreateUser(eyeOff);
    }
  }


  // const getAllUsers = async () => {

  //   try{
  //     const loggedInUser = JSON.parse(localStorage.getItem("user"));
  //     if(loggedInUser){
  //       await fetch("http://localhost:4000/users", {
  //         headers: {
  //           Authorization: `Bearer ${loggedInUser.token}`,
  //         }
  //       })
  //         .then(res => {
  //           if (!res.ok) throw new Error('Failed to fetch users!');
  //           return res.json();
  //         })
  //         .then(res => setUsers(res.data))
  //     }else{
  //       return;
  //     }
      
  //   }catch(error){
  //     console.log(error);
  //     return;
  //   }
  // }
    

  // const getAllUsers = async (page) => {

  //   try{
  //     const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  //     const ipp = {
  //       itemsPerPage: itemsPerPage,
  //     };
  //     if(loggedInUser){
  //       await fetch(`http://localhost:4000/users/get-all?page=${page}`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": `Bearer ${loggedInUser.token}`,
  //         },
  //         body: JSON.stringify(ipp)
  //       })
  //         .then(res => {
  //           if (!res.ok) throw new Error('Failed to fetch users!');
  //           return res.json();
  //         })
  //         .then((res) => {
  //           setUsers(res.data);
  //           setTotalPages(res.pagination.lastPage); // Set total pages from pagination response
  //         })
  //     }else{
  //       return;
  //     }
      
  //   }catch(error){
  //     console.log(error);
  //     return;
  //   }
  // }


  // const getAllUsers = async (page , sortType) => {

  //   try{
  //     const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  //     const bodyItems = {
  //       itemsPerPage: itemsPerPage,
  //       sortType: sortType,
  //     };
  //     if(loggedInUser){
  //       await fetch(`http://localhost:4000/users/get-all?page=${page}&sortType=${sortType}`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": `Bearer ${loggedInUser.token}`,
  //         },
  //         body: JSON.stringify(bodyItems),
  //       })
  //         .then(res => {
  //           if (!res.ok) throw new Error('Failed to fetch users!');
  //           return res.json();
  //         })
  //         .then((res) => {
  //           setUsers(res.data);
  //           setSortType(res.selectedSortType);
  //           setTotalPages(res.pagination.lastPage); // Set total pages from pagination response
  //         })
  //     }else{
  //       return;
  //     }
      
  //   }catch(error){
  //     console.log(error);
  //     return;
  //   }
  // }


  // const getAllUsers = async (page , sortType , filterType) => {

  //   try{
  //     const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  //     const bodyItems = {
  //       itemsPerPage: itemsPerPage,
  //       sortType: sortType,
  //       filterType: filterType,
  //     };
  //     if(loggedInUser){
  //       await fetch(`http://localhost:4000/users/get-all?page=${page}&sortType=${sortType}&filterType=${filterType}`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": `Bearer ${loggedInUser.token}`,
  //         },
  //         body: JSON.stringify(bodyItems),
  //       })
  //         .then(res => {
  //           if (!res.ok) throw new Error('Failed to fetch users!');
  //           return res.json();
  //         })
  //         .then((res) => {
  //           setUsers(res.data);
  //           setFilterType(res.selectedFilterType);
  //           setSortType(res.selectedSortType);
  //           setTotalPages(res.pagination.lastPage); // Set total pages from pagination response
  //         })
  //     }else{
  //       return;
  //     }
      
  //   }catch(error){
  //     console.log(error);
  //     return;
  //   }
  // }


  // const getAllUsers = async (page , sortType , filterType , searchPhrase) => {

  //   try{
  //     const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  //     const bodyItems = {
  //       itemsPerPage: itemsPerPage,
  //       sortType: sortType,
  //       filterType: filterType,
  //       searchPhrase: searchPhrase,
  //     };
  //     if(loggedInUser){
  //       await fetch(`http://localhost:4000/users/get-all?page=${page}&sortType=${sortType}&filterType=${filterType}&searchPhrase=${searchPhrase}`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": `Bearer ${loggedInUser.token}`,
  //         },
  //         body: JSON.stringify(bodyItems),
  //       })
  //         .then(res => {
  //           if (!res.ok) throw new Error('Failed to fetch users!');
  //           return res.json();
  //         })
  //         .then((res) => {
  //           setUsers(res.data);
  //           setSearchPhrase(res.searchPhrase);
  //           setFilterType(res.selectedFilterType);
  //           setSortType(res.selectedSortType);
  //           setTotalPages(res.pagination.lastPage); // Set total pages from pagination response
  //         })
  //     }else{
  //       return;
  //     }
      
  //   }catch(error){
  //     console.log(error);
  //     return;
  //   }
  // }


  const getAllUsers = async (page , sortType , filterType , searchField , searchPhrase) => {

    try{
      const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
      const bodyItems = {
        itemsPerPage: itemsPerPage,
        sortType: sortType,
        filterType: filterType,
        searchField: searchField,
        searchPhrase: searchPhrase,
      };
      if(loggedInUser){
        await fetch(`http://localhost:4000/users/get-all?page=${page}&sortType=${sortType}&filterType=${filterType}&searchField=${searchField}&searchPhrase=${searchPhrase}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${loggedInUser.token}`,
          },
          body: JSON.stringify(bodyItems),
        })
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch users!');
            return res.json();
          })
          .then((res) => {
            setUsers(res.data);
            setSearchField(res.selectedSearchField);
            setSearchPhrase(res.searchPhrase);
            setFilterType(res.selectedFilterType);
            setSortType(res.selectedSortType);
            setTotalPages(res.pagination.lastPage); // Set total pages from pagination response
          })
      }else{
        return;
      }
      
    }catch(error){
      console.log(error);
      return;
    }
  }


  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


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

  const validateInputsForCreateUser = async () => {
    try {
      await validationSchemaForCreateUser.validate({
        name: createdUserName,
        username: createdUserUsername,
        email: createdUserEmail,
        password: createdUserPassword,
        confirmPassword: createdUserConfirmPassword,
      });
      setErrorsForCreateUser({}); // Clear errors if validation passes
      return true; // Validation passed
    } catch (err) {
      setErrorsForCreateUser({
        name: err.path === 'name' ? err.message : undefined,
        username: err.path === 'username' ? err.message : undefined,
        email: err.path === 'email' ? err.message : undefined,
        password: err.path === 'password' ? err.message : undefined,
        confirmPassword: err.path === 'confirmPassword' ? err.message : undefined,
      });
      return false; // Validation failed
    }
  }

  const validateInputsForChangeUserPassword = async () => {
    try {
      await validationSchemaForChangeUserPassword.validate({
        password: editedUserPassword,
        confirmPassword: editedUserConfirmPassword,
      });
      setErrorsForChangeUserPassword({}); // Clear errors if validation passes
      setErrorsForChangeUserConfirmPassword({}); // Clear errors if validation passes
      return true; // Validation passed
    } catch (err) {
      setErrorsForChangeUserPassword({
        password: err.path === 'password' ? err.message : undefined,
      });
      setErrorsForChangeUserConfirmPassword({
        confirmPassword: err.path === 'confirmPassword' ? err.message : undefined,
      });
      return false; // Validation failed
    }
  }

  const editModalAcceptHandler = async (e) => {

    e.preventDefault();

    const isValidInputsForEditUser = await validateInputsForEditUser();
    if (!isValidInputsForEditUser) {
      return; // Stop the submission if validation fails
    }    

    const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

    const editedUser = {
      name: editedUserName,
      username: editedUserUsername,
      email: editedUserEmail,
    };

    fetch(`http://localhost:4000/users/${selectedUser._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loggedInUser.token}`,
      },
      body: JSON.stringify(editedUser)
    })
      // .then((res) => res.json())
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update user!');
        return res.json();
      })
      .then(() => {
        setIsVisibleEditModal(false);
        // getAllUsers();
        getAllUsers(currentPage , sortType , filterType , searchField , searchPhrase);
      })
      .then(() => {
        swal({
          title: "ویرایش کاربر با موفقیت انجام شد",
          icon: "success",
          buttons: "باشه",
        });
      })
      // .catch(err => console.error(err));
      .catch((err) => {
        swal({
          title: "خطایی در ویرایش کاربر رخ داده است",
          icon: "error",
          buttons: "تلاش دوباره",
        });
      });
  }

  const createModalAcceptHandler = async (e) => {

    e.preventDefault();

    const isValidInputsForCreateUser = await validateInputsForCreateUser();
    if (!isValidInputsForCreateUser) {
      return; // Stop the submission if validation fails
    }    

    const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

    const createdUser = {
      name: createdUserName,
      username: createdUserUsername,
      email: createdUserEmail,
      password: createdUserPassword,
      confirmPassword: createdUserConfirmPassword,
    };

    fetch(`http://localhost:4000/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loggedInUser.token}`,
      },
      body: JSON.stringify(createdUser)
    })
      // .then((res) => res.json())
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create user!');
        return res.json();
      })
      .then(() => {
        setIsVisibleCreateModal(false);
        // getAllUsers();
        setCurrentPage(1);
        // getAllUsers(1 , "" , "" , "");
        getAllUsers(currentPage , sortType , filterType , searchField , searchPhrase);
      })
      .then(() => {
        swal({
          title: "ایجاد کاربر جدید با موفقیت انجام شد",
          icon: "success",
          buttons: "باشه",
        });
      })
      // .catch(err => console.error(err));
      .catch((err) => {
        swal({
          title: "خطایی در ایجاد کاربر جدید رخ داده است",
          icon: "error",
          buttons: "تلاش دوباره",
        });
      });
  }

  const changeUserRoleModalAcceptHandler = async (e) => {

    e.preventDefault();

    const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

    const editedUser = {
      role: editedUserRole,
    };

    fetch(`http://localhost:4000/users/change-role/${selectedUser._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loggedInUser.token}`,
      },
      body: JSON.stringify(editedUser)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to change user role !');
        return res.json();
      })
      .then(() => {
        setIsVisibleChangeUserRoleModal(false);
        // getAllUsers();
        getAllUsers(currentPage , sortType , filterType , searchField , searchPhrase);
      })
      .then(() => {
        swal({
          title: "تغییر نقش کاربر با موفقیت انجام شد",
          icon: "success",
          buttons: "باشه",
        });
      })
      .catch((err) => {
        swal({
          title: "خطایی در تغییر نقش کاربر رخ داده است",
          icon: "error",
          buttons: "تلاش دوباره",
        });
      });

  }

  const ChangeUserPasswordModalAcceptHandler = async (e) => {

    e.preventDefault();

    const isValidInputsForChangeUserPassword = await validateInputsForChangeUserPassword();
    if (!isValidInputsForChangeUserPassword) {
      return; // Stop the submission if validation fails
    }    

    const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

    const editedUser = {
      password: editedUserPassword,
      confirmPassword: editedUserConfirmPassword,
    };

    fetch(`http://localhost:4000/users/change-password/${selectedUser._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loggedInUser.token}`,
      },
      body: JSON.stringify(editedUser)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to change user password !');
        return res.json();
      })
      .then(() => {
        setIsVisibleChangeUserPasswordModal(false);
        // getAllUsers();
        getAllUsers(currentPage , sortType , filterType , searchField , searchPhrase);
      })
      .then(() => {
        swal({
          title: "تغییر رمز عبور کاربر با موفقیت انجام شد",
          icon: "success",
          buttons: "باشه",
        });
      })
      .catch((err) => {
        swal({
          title: "خطایی در تغییر رمز عبور کاربر رخ داده است",
          icon: "error",
          buttons: "تلاش دوباره",
        });
      });

  }

  const editModalRejectHandler = () => {
    setIsVisibleEditModal(false);
  }

  const createModalRejectHandler = () => {
    setIsVisibleCreateModal(false);
  }

  const changeUserRoleModalRejectHandler = () => {
    setIsVisibleChangeUserRoleModal(false);
  }

  const ChangeUserPasswordModalRejectHandler = async (e) => {
    setIsVisibleChangeUserPasswordModal(false);
  }


  const removeUser = (id , name) => {
      const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
      swal({
        // title: "کاربر حذف شود؟",
        title: `${name} حذف شود؟`,
        icon: "warning",
        buttons: ["خیر", "بله"],
      }).then((result) => {
        if (result) {
          fetch(`http://localhost:4000/users/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${loggedInUser.token}`,
            },
          }).then((res) => {
            if (!res.ok) throw new Error('Failed to remove user!');
            if (res.ok) {

              setCurrentPage(1);
  
              // getAllUsers();
              // getAllUsers(1 , "" , "" , "");
              getAllUsers(currentPage , sortType , filterType , searchField , searchPhrase);

              swal({
                title: "کاربر با موفقیت حذف شد",
                icon: "success",
                buttons: "باشه",
              })

            }
          })
          .catch((err) => {
            swal({
              title: "خطایی در حذف کاربر رخ داده است",
              icon: "error",
              buttons: "تلاش دوباره",
            });
          });
        }
      });
    };


  const banUser = ({_id , name}) => {
    const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    swal({
      title: `${name} بن شود؟`,
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then((result) => {
      if (result) {
        fetch(`http://localhost:4000/users/ban/${_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }).then((res) => {
          if (!res.ok) throw new Error('Failed to ban user!');
          if (res.ok) {
            // getAllUsers();
            getAllUsers(currentPage , sortType , filterType , searchField , searchPhrase);
            swal({
              title: "کاربر با موفقیت بن شد",
              icon: "success",
              buttons: "باشه",
            })
          }
        })
        .catch((err) => {
          swal({
            title: "خطایی در بن کاربر رخ داده است",
            icon: "error",
            buttons: "تلاش دوباره",
          });
        });
      }
    });
  };

  const unbanUser = ({_id , name}) => {
    const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    swal({
      title: `${name} از بن خارج شود؟`,
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then((result) => {
      if (result) {
        fetch(`http://localhost:4000/users/unban/${_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }).then((res) => {
          if (!res.ok) throw new Error('Failed to unban user!');
          if (res.ok) {
            // getAllUsers();
            getAllUsers(currentPage , sortType , filterType , searchField , searchPhrase);
            swal({
              title: "کاربر با موفقیت از بن خارج شد",
              icon: "success",
              buttons: "باشه",
            })
          }
        })
        .catch((err) => {
          swal({
            title: "خطایی در خروج کاربر از بن رخ داده است",
            icon: "error",
            buttons: "تلاش دوباره",
          });
        });
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 27) {
        setIsVisibleDetailsModal(false);
        setIsVisibleEditModal(false);
        setIsVisibleCreateModal(false);
        setIsVisibleChangeUserRoleModal(false);
        setIsVisibleChangeUserPasswordModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  // useEffect(() => {
  //   getAllUsers();
  // }, [])


  useEffect(() => {
    getAllUsers(currentPage , sortType , filterType , searchField , searchPhrase);
  }, [currentPage]); // Fetch users when currentPage changes


  useEffect(() => {
    setCurrentPage(1);
    getAllUsers(1 , sortType , filterType , searchField , searchPhrase);
  }, [itemsPerPage , sortType , filterType , searchField , searchPhrase]); // Fetch users when itemsPerPage or sortType or searchField or searchPhrase changes


  useEffect(() => {
    // Update edited user fields when selectedUser changes
    if (selectedUser) {
      setEditedUserName(selectedUser.name || "");
      setEditedUserUsername(selectedUser.username || "");
      setEditedUserEmail(selectedUser.email || "");
      setEditedUserRole(selectedUser.role || "");
    }
  }, [selectedUser]);

  return (
    <>
      <div className="home-content-edit">
        <div className="back-btn">
          <i className="fas fa-arrow-right"></i>
        </div>

        <button
          type="button"
          className="btn btn-primary create-btn"
          onClick={() => {
            setPasswordInputTypeForCreateUser("password");
            setConfirmPasswordInputTypeForCreateUser("password");
            setPasswordIconForCreateUser(eyeOff);
            setConfirmPasswordIconForCreateUser(eyeOff);
            setErrorsForCreateUser({});
            setIsVisibleCreateModal(true);
          }}
        >
          ایجاد کاربر جدید
        </button>

      </div>

      <div className="section-operations">
        <div className="items-per-page">
          <label>تعداد آیتم ها در صفحه : </label>
          <select className="items-per-page-select" defaultValue={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <div className="items-per-page">
          <label>مرتب سازی بر اساس : </label>
          <select className="items-per-page-select" defaultValue={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="">پیشفرض</option>
            <option value="name-asc">نام(صعودی)</option>
            <option value="name-desc">نام(نزولی)</option>
            <option value="username-asc">نام کاربری(صعودی)</option>
            <option value="username-desc">نام کاربری(نزولی)</option>
            <option value="email-asc">ایمیل(صعودی)</option>
            <option value="email-desc">ایمیل(نزولی)</option>
            <option value="createdAt-asc">تاریخ عضویت(صعودی)</option>
            <option value="createdAt-desc">تاریخ عضویت(نزولی)</option>
            <option value="updatedAt-asc">تاریخ ویرایش اطلاعات(صعودی)</option>
            <option value="updatedAt-desc">تاریخ ویرایش اطلاعات(نزولی)</option>
          </select>
        </div>

        <div className="items-per-page">
          <label>فیلتر بر اساس : </label>
          <select className="items-per-page-select" defaultValue={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">بدون فیلتر</option>
            <option value="role-admin">نقش مدیر</option>
            <option value="role-user">نقش کاربر عادی</option>
            <option value="isBan">کاربر بن شده</option>
            <option value="notIsBan">کاربر بن نشده</option>
          </select>
        </div>

        <div className="items-per-page">
          <label>جستجو در فیلد : </label>
          <select className="items-per-page-select" defaultValue={searchField} onChange={(e) => setSearchField(e.target.value)}>
            <option value="">انتخاب کنید</option>
            <option value="name">نام</option>
            <option value="username">نام کاربری</option>
            <option value="email">ایمیل</option>
            <option value="all">نام و نام کاربری و ایمیل</option>
          </select>
          <label>بر اساس کلمه کلیدی : </label>
          <input className="items-per-page-select" placeholder="تایپ کنید ..." defaultValue={searchPhrase} onChange={(e) => setSearchPhrase(e.target.value)} />
        </div>

      </div>

      {
        users.length === 0
        ? <ErrorBox msg="کاربری با مشخصات مورد نظر یافت نشد" />
        : (
            <AdminPanelDatatable title="کاربران">

              <table className="table">
                <thead>
                  <tr>
                    <th>نام</th>
                    <th>نام کاربری</th>
                    <th>ایمیل</th>
                    <th>نقش</th>
                    <th>جزییات</th>
                    <th>ویرایش</th>
                    <th>تغییر نقش</th>
                    <th>تغییر رمز عبور</th>
                    <th>حذف</th>
                    <th>بن</th>
                  </tr>
                </thead>
                <tbody>

                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role === 'ADMIN' ? "مدیر" : "کاربر عادی"}</td>
                      <td>
                        {
                          user.role !== "ADMIN" && (
                            <button
                              type="button"
                              className="btn btn-primary edit-btn"
                              onClick={() => {
                                setIsVisibleDetailsModal(true);
                                setSelectedUser(user);
                              }}
                            >
                              جزییات
                            </button>
                          )
                        }
                      </td>
                      <td>
                        {
                          user.role !== "ADMIN" && (
                            <button
                              type="button"
                              className="btn btn-primary edit-btn"
                              onClick={() => {
                                setErrorsForEditUser({});
                                setIsVisibleEditModal(true);
                                setSelectedUser(user);
                              }}
                            >
                              ویرایش
                            </button>
                          )
                        }
                      </td>
                      <td>
                        {
                          user.role !== "ADMIN" && (
                            <button
                              type="button"
                              className="btn btn-primary edit-btn"
                              onClick={() => {
                                setIsVisibleChangeUserRoleModal(true);
                                setSelectedUser(user);
                              }}
                            >
                              تغییر نقش
                            </button>
                          )
                        }
                      </td>
                      <td>
                        {
                          user.role !== "ADMIN" && (
                            <button
                              type="button"
                              className="btn btn-primary edit-btn"
                              onClick={() => {
                                setPasswordInputTypeForChangeUserPassword("password");
                                setConfirmPasswordInputTypeForChangeUserPassword("password");
                                setPasswordIconForChangeUserPassword(eyeOff);
                                setConfirmPasswordIconForChangeUserPassword(eyeOff);
                                setErrorsForChangeUserPassword({});
                                setErrorsForChangeUserConfirmPassword({});
                                setIsVisibleChangeUserPasswordModal(true);
                                setSelectedUser(user);
                              }}
                            >
                              تغییر رمز عبور
                            </button>
                          )
                        }
                      </td>
                      <td>
                        {
                          user.role !== "ADMIN" && (
                            <button
                              type="button"
                              className="btn btn-danger delete-btn"
                              onClick={() => {
                                removeUser(user._id , user.name);
                              }}
                            >
                              حذف
                            </button>
                          )
                        }
                      </td>
                      <td>
                        {
                          user.role !== "ADMIN" && (
                            <button
                              type="button"
                              className="btn btn-danger delete-btn"
                              onClick={() => {
                                !user.isBan ? banUser({...user}) : unbanUser({...user});
                              }}
                            >
                              {user.isBan ? "خروج از بن" : "بن"}
                            </button>
                          )
                        }
                      </td>
                    </tr>
                  ))} 

                </tbody>
              </table>
              
            </AdminPanelDatatable>
          )
      }


      {isVisibleDetailsModal && (
        <DetailsModal selectedItem={selectedUser.username}>
          <table className="cms-table">
            <thead>
              <tr>
                <th>نام</th>
                <th>نام کاربری</th>
                <th>ایمیل</th>
                <th>نقش</th>
                <th>تاریخ عضویت</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedUser.name}</td>
                <td>{selectedUser.username}</td>
                <td>{selectedUser.email}</td>
                <td>{selectedUser.role}</td>
                <td>{selectedUser.createdAt}</td>
              </tr>
            </tbody>
          </table>
          {/* <div style={{display:"flex", justifyContent:"center", paddingTop:"20px"}}>
            <button className="btn btn-primary" style={{fontSize: "20px"}} onClick={() => setIsVisibleDetailsModal(false)}>بستن</button>
          </div> */}
          <div className="details-user-info-btn-group">
            <button className="btn btn-primary details-user-info-btn" onClick={() => setIsVisibleDetailsModal(false)}>بستن</button>
          </div>
        </DetailsModal>
      )}


      {isVisibleEditModal && (
        <EditModal
          editModalAcceptHandler={editModalAcceptHandler}
          editModalRejectHandler={editModalRejectHandler}
          // editModalTitle="ویرایش اطلاعات کاربر"
          editModalTitle={`ویرایش اطلاعات ${selectedUser.username}`}
          editModalYesBtn="ثبت اطلاعات جدید"
          editModalNoBtn="انصراف"
          >

          <div className="edit-user-info-input-group">
            <label>نام:</label>
            <input
              type="text"
              className="edit-user-info-input"
              // placeholder="مقدار جدید را وارد نمایید"
              // placeholder={selectedUser.name}
              value={editedUserName}
              onChange={(e) => setEditedUserName(e.target.value)}
            />
            {/* {errors.name && <span className="error-message">{errors.name}</span>} */}
            {errorsForEditUser.name && <div className="error-message">{errorsForEditUser.name}</div>}
          </div>

          <div className="edit-user-info-input-group">
            <label>نام کاربری:</label>
            <input
              type="text"
              className="edit-user-info-input"
              // placeholder="مقدار جدید را وارد نمایید"
              // placeholder={selectedUser.username}
              value={editedUserUsername}
              onChange={(e) => setEditedUserUsername(e.target.value)}
            />
            {errorsForEditUser.username && <span className="error-message">{errorsForEditUser.username}</span>}
          </div>

          <div className="edit-user-info-input-group">
            <label>ایمیل:</label>
            <input
              type="text"
              className="edit-user-info-input"
              // placeholder="مقدار جدید را وارد نمایید"
              // placeholder={selectedUser.email}
              value={editedUserEmail}
              onChange={(e) => setEditedUserEmail(e.target.value)}
            />
            {errorsForEditUser.email && <span className="error-message">{errorsForEditUser.email}</span>}
          </div>

        </EditModal>
      )}


      {/* {isVisibleCreateModal && (
        <CreateModal createModalAcceptHandler={createModalAcceptHandler} createModalRejectHandler={createModalRejectHandler}> */}
      
      {isVisibleCreateModal && (
        <EditModal
          editModalAcceptHandler={createModalAcceptHandler}
          editModalRejectHandler={createModalRejectHandler}
          editModalTitle="ایجاد کاربر جدید"
          editModalYesBtn="ثبت اطلاعات کاربر جدید"
          editModalNoBtn="انصراف"
          >

          <div className="edit-user-info-input-group">
            <label>نام:</label>
            <input
              type="text"
              className="edit-user-info-input"
              onChange={(e) => setCreatedUserName(e.target.value)}
            />
            {errorsForCreateUser.name && <div className="error-message">{errorsForCreateUser.name}</div>}
          </div>

          <div className="edit-user-info-input-group">
            <label>نام کاربری:</label>
            <input
              type="text"
              className="edit-user-info-input"
              onChange={(e) => setCreatedUserUsername(e.target.value)}
            />
            {errorsForCreateUser.username && <span className="error-message">{errorsForCreateUser.username}</span>}
          </div>

          <div className="edit-user-info-input-group">
            <label>ایمیل:</label>
            <input
              type="text"
              className="edit-user-info-input"
              onChange={(e) => setCreatedUserEmail(e.target.value)}
            />
            {errorsForCreateUser.email && <span className="error-message">{errorsForCreateUser.email}</span>}
          </div>

          <div className="edit-user-info-input-group">
            <label>رمز عبور</label>
            <div className="admin-panel-users-password">
              <input
                // type="password"
                type={passwordInputTypeForCreateUser}
                className="edit-user-info-input"
                onChange={(e) => setCreatedUserPassword(e.target.value)}
              />
              <span className="admin-panel-users-password-icon" onClick={passwordInputHandlerForCreateUser} ><Icon icon={passwordIconForCreateUser} size={25} /></span>
            </div>
            {errorsForCreateUser.password && <span className="error-message">{errorsForCreateUser.password}</span>}
          </div>

          <div className="edit-user-info-input-group">
            <label>تکرار رمز عبور</label>
            <div className="admin-panel-users-password">
              <input
                // type="password"
                type={confirmPasswordInputTypeForCreateUser}
                className="edit-user-info-input"
                onChange={(e) => setCreatedUserConfirmPassword(e.target.value)}
              />
              <span className="admin-panel-users-password-icon" onClick={confirmPasswordInputHandlerForCreateUser} ><Icon icon={confirmPasswordIconForCreateUser} size={25} /></span>
            </div>
            {errorsForCreateUser.confirmPassword && <span className="error-message">{errorsForCreateUser.confirmPassword}</span>}
          </div>

        </EditModal>
      )}


      {isVisibleChangeUserRoleModal && (
        <EditModal
          editModalAcceptHandler={changeUserRoleModalAcceptHandler}
          editModalRejectHandler={changeUserRoleModalRejectHandler}
          // editModalTitle="تغییر نقش کاربر"
          editModalTitle={`تغییر نقش ${selectedUser.username}`}
          editModalYesBtn="ثبت تغییر نقش"
          editModalNoBtn="انصراف"
          >

          <div className="edit-user-info-input-group">
            <select className="user-role-group" defaultValue={selectedUser.role} onChange={(e) => setEditedUserRole(e.target.value)}>
              <option value="USER">کاربر عادی</option>
              <option value="ADMIN">مدیر</option>
            </select>
          </div>

        </EditModal>
      )}


      {isVisibleChangeUserPasswordModal && (
        <EditModal
          editModalAcceptHandler={ChangeUserPasswordModalAcceptHandler}
          editModalRejectHandler={ChangeUserPasswordModalRejectHandler}
          // editModalTitle="تغییر رمز عبور کاربر"
          editModalTitle={`تغییر رمز عبور ${selectedUser.username}`}
          editModalYesBtn="ثبت رمز عبور جدید"
          editModalNoBtn="انصراف"
        >

          <div className="edit-user-info-input-group">
            <label>رمز عبور جدید</label>
            <div className="admin-panel-users-password">
              <input
                // type="text"
                type={passwordInputTypeForChangeUserPassword}
                className="edit-user-info-input"
                onChange={(e) => setEditedUserPassword(e.target.value)}
              />
              <span className="admin-panel-users-password-icon" onClick={passwordInputHandlerForChangeUserPassword} ><Icon icon={passwordIconForChangeUserPassword} size={25} /></span>
            </div>
            {errorsForChangeUserPassword.password && <span className="error-message">{errorsForChangeUserPassword.password}</span>}
          </div>

          <div className="edit-user-info-input-group">
            <label>تکرار رمز عبور جدید</label>
            <div className="admin-panel-users-password">
              <input
                // type="text"
                type={confirmPasswordInputTypeForChangeUserPassword}
                className="edit-user-info-input"
                onChange={(e) => setEditedUserConfirmPassword(e.target.value)}
              />
              <span className="admin-panel-users-password-icon" onClick={confirmPasswordInputHandlerForChangeUserPassword} ><Icon icon={confirmPasswordIconForChangeUserPassword} size={25} /></span>
            </div>
            {errorsForChangeUserConfirmPassword.confirmPassword && <span className="error-message">{errorsForChangeUserConfirmPassword.confirmPassword}</span>}
          </div>

        </EditModal>
      )}


      <nav className="pagination-nav">
        <ul className="pagination pagination-lg justify-content-center">
          {currentPage > 1 && (
            <>
              <li className="page-item">
                <a className="page-link" onClick={() => handlePageChange(1)}>اولین</a>
              </li>
              <li className="page-item">
                <a className="page-link" onClick={() => handlePageChange(currentPage - 1)}>قبلی</a>
              </li>
            </> 
          )}
          {/* {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <a className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</a>
            </li>
          ))} */}
          <li className="page-item active">
            <a className="page-link">{currentPage}</a>
          </li>
          {currentPage < totalPages && (
            <>
              <li className="page-item">
                <a className="page-link" onClick={() => handlePageChange(currentPage + 1)}>بعدی</a>
              </li>
              <li className="page-item">
                <a className="page-link" onClick={() => handlePageChange(totalPages)}>آخرین</a>
              </li>
            </>
          )}
        </ul>
      </nav>


    </>
  );

}

export default AdminPanelUsers;
