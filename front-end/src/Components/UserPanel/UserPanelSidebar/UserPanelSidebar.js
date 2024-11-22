import React , { useContext } from "react";
import AuthContext from "../../../context/authContext";
import { Link , useLocation } from "react-router-dom";

import "./UserPanelSidebar.css"


export default function UserPanelSidebar() {

  const authContext = useContext(AuthContext);

  const location = useLocation();


  return (
    <div className="col-3">
      <div className="sidebar">
        <div className="sidebar__name">{authContext.userInfos.username} عزیز ! خوش آمدید !</div>
        <ul className="sidebar__list">

          <li className="sidebar__item">
            <Link className={location.pathname==="/my-account" ? "sidebar__link active" : "sidebar__link"} to="/my-account">
              پیشخوان
            </Link>
          </li>

          <li className="sidebar__item">
            <Link className={location.pathname==="/my-account/edit-account" ? "sidebar__link active" : "sidebar__link"} to="edit-account">
              ویرایش حساب کاربری
            </Link>
          </li>

          <li className="sidebar__item">
            <Link className={location.pathname==="/my-account/change-password" ? "sidebar__link active" : "sidebar__link"} to="change-password">
              تغییر رمز عبور
            </Link>
          </li>
          
        </ul>
      </div>
    </div>
  );
}
