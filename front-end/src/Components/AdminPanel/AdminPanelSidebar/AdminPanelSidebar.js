import React , { useContext } from "react";
import { Link , useLocation } from "react-router-dom";
import AuthContext from "./../../../context/authContext";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

import "./AdminPanelSidebar.css"


function AdminPanelSidebar() {

//   return <div>Admin-Panel-Sidebar</div>;

  const location = useLocation();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = (e) => {
    e.preventDefault();
    
    swal({
      title: "آیا از خروج اطمینان دارید",
      icon: "warning",
      buttons: ["خیر" , "بله"]
    }).then((result) => {
      if(result){
        authContext.logout();
        swal({
          title: "با موفقیت خارج شدید",
          icon: "success",
          buttons: "باشه",
        }).then(() => {
          navigate("/");
        });
      }
    })

  }

  return (
    <div id="sidebar" className="col-2">
      <div className="sidebar-header">
        {/* <div className="sidebar-logo">
          <a href="#">
            <img src="/images/logo/Logo.png" alt="Logo" />
          </a>
        </div> */}

        <div className="sidebar-menu-btn">
          <i className="fas fa-bars"></i>
        </div>
      </div>
      <div className="sidebar-menu">
        <ul>

          <li>
            <Link to="/">
              <span>برگشت به سایت</span>
            </Link>
          </li>

          <li className="border-bottom">
            <Link to="#" onClick={logoutHandler}>
              <span>خروج از سایت</span>
            </Link>
          </li>
          
          {/* <li className="active-menu"> */}
          <li className={location.pathname === "/admin-panel" ? "active-menu" : ""}>
            <Link to="/admin-panel">
              <span>پیشخوان</span>
            </Link>
          </li>
          
          <li className={location.pathname === "/admin-panel/users" ? "active-menu" : ""}>
            <Link to="users">
              <span>کاربران</span>
            </Link>
          </li>

        </ul>
      </div>
    </div>
  );

}

export default AdminPanelSidebar;
